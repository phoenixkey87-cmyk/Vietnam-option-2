# Flight Monitor spec

Tracks the lowest round-trip fare per person (Economy, Business, First) for both Vietnam itineraries, with history, change, and alerts. Checked on **2026-11-02**.

## 1. API recommendation: SerpApi Google Flights

| Candidate | Status / fit |
|---|---|
| **SerpApi Google Flights (chosen)** | Structured JSON of Google Flights results. Supports round trip, one way and multi-city (`type`, `multi_city_json`), cabin filter (`travel_class`: economy, premium economy, business, first), `currency=USD`, and returns `price`, `layovers`, `total_duration` and `search_metadata.google_flights_url`. A free plan exists. [Google Flights API docs](https://serpapi.com/google-flights-api), [pricing](https://serpapi.com/pricing). |
| Amadeus Self-Service | Not usable: the self-service portal was decommissioned on 17 July 2026 and keys were disabled. [PhocusWire](https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers), [dev.to](https://dev.to/ishemah/amadeus-self-service-shut-down-on-july-17-heres-a-drop-in-replacement-for-flight-prices-1npn). |
| Duffel | Built for searching and booking flights (offer requests, orders), with a per-order fee model. It is a poor fit for a read-only tracker. [Duffel pricing](https://duffel.com/pricing), [offer requests](https://duffel.com/docs/api/offer-requests). |

Why SerpApi: it is the only candidate that is both available and a read-only fare lookup. It handles open-jaw through multi-city, filters by cabin including first, returns USD totals as Google displays them (taxes included), and gives a deep link. Press reports of the free plan quota and paid tiers (250 searches/month free, per third-party summaries dated Aug-Oct 2026) should be re-checked on the [pricing page](https://serpapi.com/pricing) before relying on them.

Re-verify before first live use (these were NOT confirmed against a live key): the exact `multi_city_json` leg format, that multi-city `price` is the total for all legs, the credit cost per search, and the wording of SerpApi's "no results" error.

The provider sits behind `fm/providers/base.py` (`FareProvider.search(query) -> Fare`). To swap providers, add a class and select it in `run_monitor.py`.

## 2. Data model

`flight-monitor/data/latest.json` (also written as `latest.js`: `window.FLIGHT_MONITOR_DATA = {...};`)

```
{ schema_version: 1, mode: "live" | "no_api_key" | "sample", generated_at, last_checked,
  source: {name, url}, thresholds: {...}, sample_notice?,
  itineraries: { <id>: { label, arrive, depart, origin, travelers, outbound_date, return_date,
    rows: [ { id, route, origin, kind: primary|alternate|traveler, traveler_name, cabin,
              status: ok|not_offered|not_verified, reason, airline, stops, duration_min, layovers[],
              price_usd (only when ok), booking_url, checked_at,
              change: {usd, direction}, low_30d, drop_flag,
              shift: {offset_days, dates, price_usd, saving_usd} | null,
              alt_flag, alt_saving_usd, stl_price_usd } ] } } }
```

Statuses: `ok` (real fare returned), `not_offered` (only when the API answered successfully with an explicit no-results message for that cabin AND the Economy query on the same route returned fares), `not_verified` (everything else: errors, timeouts, empty or odd responses, missing key, call budget reached). A cabin is never replaced by another cabin; the provider also rejects any result whose `travel_class` is not the one requested.

History is SQLite at `flight-monitor/data/history.sqlite` (gitignored), table `checks`, one row per check.

## 3. Rules

- Change: current ok price minus the previous ok price for the same row.
- 30-day low: lowest ok price in the trailing 30 days including today.
- Drop flag: price fell by MORE than 10% versus the previous ok check.
- Date shift: both legs moved by -3 and +3 days; flagged when the best shifted price saves $200 or more per person. Shifts run for primary rows in the cabins listed under `cabins_by_kind.shift`, at most every `shift_check_interval_days`.
- Alternate origins (MCI, ORD, ATL): shown only when the same-cabin fare is $300 or more cheaper than STL.
- Open-jaw: one multi-city search per origin and cabin (origin to arrival airport, departure airport back to origin). Same airport: normal round trip.
- Stops, duration, layovers and airline describe the outbound trip as returned by the API; the price is the whole itinerary.

## 4. Config reference (`flight-monitor/config.json`)

| Key | Meaning |
|---|---|
| `home_airport`, `alternate_origins` | STL and the alternates |
| `thresholds` | `drop_pct` 10, `shift_usd` 200, `alt_origin_usd` 300, `shift_days` 3, `low_window_days` 30 |
| `cabins_by_kind` | cabins queried for `primary`, `alternate`, `traveler`, `shift` rows |
| `max_calls_per_run` | API call budget (default 40); rows past it are `not_verified` ("call budget reached") |
| `shift_check_interval_days` | how often shifted dates are re-queried (default 7) |
| `schedule.time` | daily run time, `HH:mm` local, used by `register_task.ps1` |
| `travelers` | list of `{ "name", "home_airport" }`; empty by default (no invented people). See `travelers_example` (ignored by code) |
| `itineraries` | per itinerary: `arrive`, `depart`, `outbound_date`, `return_date`, `travelers`, `travelers_source` |

Itinerary values: Option 2 arrives DAD and departs SGN, Nov 21-29 2027, 1 traveler (`budgetDefaults.travellers`). The original arrives HAN and departs SGN, same dates, traveler count not stated anywhere (so no group total). `outbound_date` is 2027-11-20 (US departure the day before landing on Nov 21 local); this is an assumption you can edit.

Worst-case calls per run: 12 base queries (two itineraries, STL x3 cabins, 3 alternates) + 4 shifted-date queries + one per configured traveler per itinerary = about 16 plus travelers. The free plan quota should be checked against daily runs.

## 5. Keys and running

1. Copy `.env.example` to `.env` (gitignored), set `SERPAPI_API_KEY`. The key is read only from the environment or `.env`; it is never written to output.
2. `python flight-monitor/run_monitor.py` (no key: succeeds, writes all rows `not_verified`).
3. `python flight-monitor/run_monitor.py --dry-run` prints planned queries and does nothing else.
4. `--mock flight-monitor/tests/fixtures/mock_sample.json` writes labelled SAMPLE output to `flight-monitor/data/sample/` (gitignored). The UI shows no prices for any snapshot that is not `mode: "live"`.
5. Tests: `python -m unittest discover -s flight-monitor/tests -t flight-monitor -v` (no network, no key).

## 6. Scheduling

- Windows: `powershell -ExecutionPolicy Bypass -File flight-monitor/register_task.ps1` (supports `-WhatIf`, `-Unregister`). Reads `schedule.time`; re-run after changing it. The task holds no secrets.
- GitHub Actions: `flight-monitor/examples/daily-refresh.yml.example`. NOT enabled. Copy to `.github/workflows/` and add the repo secret `SERPAPI_API_KEY`. Runners start without `history.sqlite`, so change and 30-day low reset each run.

## 7. Page behaviour

Pages load `data/latest.js` via script tag (works from `file://`), then try `fetch('flight-monitor/data/latest.json')` for fresher data. If neither works, rows render as "not verified" with an explanation.

## 8. Limitations

- November 2027 is at or beyond the roughly 330-355 day schedule window of most airlines as of 2026-11-02, so "not verified" will be common. That is a valid result, not an error.
- The booking link is the Google Flights search for that query. It is not a guaranteed fare.
- Prices are per person (adults=1), USD, as Google Flights reports them.
- Layovers and stops are for the outbound trip only.
- The itinerary's older copy `keysha-vietnam-site/` was left untouched.
