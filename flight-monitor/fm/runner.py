"""Orchestrates one refresh: query, classify, store history, build rows."""
import re
from datetime import date, datetime, timedelta

from . import analysis, snapshot
from .models import Fare, Query, STATUS_OK, not_verified

CABIN_ORDER = {"economy": 0, "business": 1, "first": 2}


def _shift_date(iso, days):
    return (date.fromisoformat(iso) + timedelta(days=days)).isoformat()


def _slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _iso(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


class Budgeted:
    """Counts provider calls and stops at max_calls."""

    def __init__(self, provider, max_calls):
        self.provider = provider
        self.max_calls = int(max_calls)
        self.calls = 0

    def search(self, query):
        if self.calls >= self.max_calls:
            return not_verified(query.cabin, "call budget reached")
        self.calls += 1
        return self.provider.search(query)


def route_label(origin, arrive, depart):
    if arrive == depart:
        return "%s \u21c4 %s" % (origin, arrive)
    return "%s \u2192 %s / %s \u2192 %s" % (origin, arrive, depart, origin)


def plan(cfg):
    """Return the list of base (non-shift) queries per itinerary: (itin_id, kind, name, Query)."""
    out = []
    home = cfg["home_airport"]
    cabins = cfg["cabins_by_kind"]
    for itin_id, it in cfg["itineraries"].items():
        def q(origin, cabin, itin=it, iid=itin_id):
            return Query(iid, origin, itin["arrive"], itin["depart"], itin["outbound_date"], itin["return_date"], cabin)

        for cabin in sorted(cabins["primary"], key=CABIN_ORDER.get):
            out.append((itin_id, "primary", None, q(home, cabin)))
        for origin in cfg.get("alternate_origins", []):
            for cabin in sorted(cabins["alternate"], key=CABIN_ORDER.get):
                out.append((itin_id, "alternate", None, q(origin, cabin)))
        for t in cfg.get("travelers", []):
            for cabin in sorted(cabins["traveler"], key=CABIN_ORDER.get):
                out.append((itin_id, "traveler", t["name"], q(t["home_airport"], cabin)))
    return out


def run_checks(cfg, provider, history, now, live, max_calls=None):
    """Run every check and return (itineraries dict for the snapshot, calls_made).

    live=False means no credentials: no provider call, no history write, every row
    "not verified" with checked_at null.
    """
    th = cfg["thresholds"]
    budget = Budgeted(provider, max_calls if max_calls is not None else cfg["max_calls_per_run"])
    now_iso = _iso(now)
    interval = timedelta(days=cfg["shift_check_interval_days"])
    low_window = int(th["low_window_days"])
    offsets = [-int(th["shift_days"]), int(th["shift_days"])]
    result = {}

    for itin_id, it in cfg["itineraries"].items():
        rows = []
        econ = {}  # (origin, offset) -> finalized economy Fare
        by_origin_cabin = {}  # (origin, cabin) -> row, for alternate comparison

        def do_check(q, row_key, kind, offset):
            """Return (fare, checked_iso_or_None)."""
            if not live:
                return not_verified(q.cabin, "no API key"), None
            raw = budget.search(q)
            raw = analysis.resolve_cabin({raw.cabin: raw}, q.cabin)  # reject any cabin mismatch
            fare = analysis.finalize_fare(raw, econ.get((q.origin, offset)))
            if q.cabin == "economy":
                econ[(q.origin, offset)] = fare
            fare.checked_at = now_iso
            history.insert(itin_id, row_key, kind, offset, fare, now)
            return fare, now_iso

        for (iid, kind, name, base_q) in [p for p in plan(cfg) if p[0] == itin_id]:
            slug = "traveler:" + _slug(name) if kind == "traveler" else kind
            row_key = "%s|%s|%s|%s" % (itin_id, base_q.origin, slug, base_q.cabin)
            prev = history.previous_ok_price(row_key) if live else None
            fare, checked = do_check(base_q, row_key, kind, 0)
            cur = fare.price_usd if fare.status == STATUS_OK else None
            hist = history.ok_prices_since(row_key, now - timedelta(days=low_window)) if live else []
            row = {
                "id": row_key,
                "route": route_label(base_q.origin, base_q.arrive, base_q.depart),
                "origin": base_q.origin,
                "kind": kind,
                "traveler_name": name,
                "cabin": base_q.cabin,
                "status": fare.status,
                "reason": fare.reason,
                "airline": fare.airline,
                "stops": fare.stops,
                "duration_min": fare.duration_min,
                "layovers": fare.layovers,
                "booking_url": fare.booking_url if fare.status == STATUS_OK else None,
                "checked_at": checked,
                "low_30d": analysis.low_30d(hist, now, low_window) if cur is not None else None,
                "change": analysis.change(cur, prev),
                "drop_flag": analysis.is_drop(cur, prev, th["drop_pct"]),
                "shift": None,
                "alt_flag": False,
            }
            if cur is not None:
                row["price_usd"] = cur
            by_origin_cabin[(base_q.origin, kind, base_q.cabin, name)] = row

            # +/- N day shifts, only for primary rows of cabins listed under "shift".
            if kind == "primary" and base_q.cabin in cfg["cabins_by_kind"]["shift"] and live and cur is not None:
                options = []
                for off in offsets:
                    skey = "%s|shift%+d" % (row_key, off)
                    last = history.latest(skey)
                    due = last is None or now - last["checked_dt"] >= interval
                    sq = Query(
                        itin_id, base_q.origin, base_q.arrive, base_q.depart,
                        _shift_date(base_q.outbound_date, off), _shift_date(base_q.return_date, off), base_q.cabin,
                    )
                    if due:
                        sfare, _ = do_check(sq, skey, "shift", off)
                        price, when = (sfare.price_usd if sfare.status == STATUS_OK else None), now_iso
                    else:
                        price = last["price_usd"] if last["status"] == STATUS_OK else None
                        when = last["checked_at"]
                    options.append({
                        "offset_days": off,
                        "dates": [sq.outbound_date, sq.return_date],
                        "price_usd": price,
                        "checked_at": when,
                    })
                best = analysis.best_shift(cur, options, th["shift_usd"])
                if best:
                    row["shift"] = {
                        "offset_days": best["offset_days"],
                        "dates": best["dates"],
                        "price_usd": best["price_usd"],
                        "saving_usd": best["saving_usd"],
                    }
            rows.append(row)

        # Alternate origins are shown only when >= alt_origin_usd cheaper than STL, same cabin.
        home = cfg["home_airport"]
        kept = []
        for row in rows:
            if row["kind"] != "alternate":
                kept.append(row)
                continue
            stl_row = by_origin_cabin.get((home, "primary", row["cabin"], None))
            stl_price = stl_row.get("price_usd") if stl_row else None
            alt_price = row.get("price_usd")
            if analysis.alt_origin_flag(stl_price, alt_price, th["alt_origin_usd"]):
                row["alt_flag"] = True
                row["alt_saving_usd"] = round(stl_price - alt_price, 2)
                row["stl_price_usd"] = stl_price
                kept.append(row)
        result[itin_id] = {
            "label": it.get("label", itin_id),
            "arrive": it["arrive"],
            "depart": it["depart"],
            "origin": home,
            "travelers": it.get("travelers"),
            "outbound_date": it["outbound_date"],
            "return_date": it["return_date"],
            "rows": kept,
        }
    return result, budget.calls


def build_snapshot(cfg, provider, history, now, mode):
    live = mode in ("live", "sample")
    itins, calls = run_checks(cfg, provider, history, now, live)
    snap = snapshot.build(
        mode,
        _iso(now),
        {"name": provider.name, "url": provider.url},
        cfg["thresholds"],
        itins,
    )
    return snap, calls
