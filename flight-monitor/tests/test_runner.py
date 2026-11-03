import copy
import json
import os
import re
import tempfile
import unittest
from datetime import datetime
from unittest import mock

import run_monitor
from fm import config as config_mod
from fm import runner
from fm.history import History
from fm.providers.mock import MockProvider

HERE = os.path.dirname(os.path.abspath(__file__))
FIXTURE = os.path.join(HERE, "fixtures", "mock_sample.json")
CONFIG = os.path.join(os.path.dirname(HERE), "config.json")
NOW = datetime(2026, 11, 2, 6, 0, 0)


def cfg():
    return config_mod.load(CONFIG)


def all_rows(snap, itin):
    return snap["itineraries"][itin]["rows"]


class NoKeyTests(unittest.TestCase):
    def test_no_key_everything_not_verified_and_no_calls(self):
        provider = MockProvider(fares={})
        h = History(":memory:")
        snap, calls = runner.build_snapshot(cfg(), provider, h, NOW, "no_api_key")
        h.close()
        self.assertEqual(calls, 0)
        self.assertEqual(provider.calls, [])
        self.assertEqual(snap["mode"], "no_api_key")
        for itin in snap["itineraries"].values():
            self.assertEqual({r["cabin"] for r in itin["rows"]}, {"economy", "business", "first"})
            for r in itin["rows"]:
                self.assertEqual(r["status"], "not_verified")
                self.assertNotIn("price_usd", r)
                self.assertIsNone(r["booking_url"])
                self.assertIsNone(r["checked_at"])


class MockRunTests(unittest.TestCase):
    def run_it(self, config=None):
        c = config or cfg()
        provider = MockProvider(path=FIXTURE)
        h = History(":memory:")
        self.addCleanup(h.close)
        snap, calls = runner.build_snapshot(c, provider, h, NOW, "sample")
        return snap, calls, h

    def test_flags_end_to_end(self):
        snap, calls, _ = self.run_it()
        self.assertEqual(snap["mode"], "sample")
        self.assertIn("SAMPLE", snap["sample_notice"])
        rows = {(r["origin"], r["kind"], r["cabin"]): r for r in all_rows(snap, "option2")}
        econ = rows[("STL", "primary", "economy")]
        self.assertEqual(econ["price_usd"], 2000)
        self.assertEqual(econ["shift"]["offset_days"], -3)  # 1750 saves $250
        self.assertEqual(econ["shift"]["saving_usd"], 250)
        self.assertEqual(econ["low_30d"], 2000)
        self.assertIsNone(econ["change"])  # first check
        # ORD is $400 cheaper -> flagged; MCI is only $200 cheaper -> hidden; ATL has no fare -> hidden.
        alts = {r["origin"]: r for r in all_rows(snap, "option2") if r["kind"] == "alternate"}
        self.assertEqual(list(alts), ["ORD"])
        self.assertTrue(alts["ORD"]["alt_flag"])
        self.assertEqual(alts["ORD"]["alt_saving_usd"], 400)
        # First empty while economy ok -> Not offered; Business never fills in.
        first = rows[("STL", "primary", "first")]
        self.assertEqual(first["status"], "not_offered")
        self.assertNotIn("price_usd", first)

    def test_first_never_gets_business_fare_even_if_fixture_is_wrong(self):
        snap, _, _ = self.run_it()
        # The HAN fixture mislabels a business fare as the "first" result; the runner must reject it.
        rows = {(r["cabin"]): r for r in all_rows(snap, "original")}
        self.assertEqual(rows["business"]["status"], "not_offered")
        self.assertEqual(rows["first"]["status"], "not_verified")
        self.assertNotIn("price_usd", rows["first"])

    def test_second_run_computes_change_and_drop(self):
        c = cfg()
        provider = MockProvider(path=FIXTURE)
        h = History(":memory:")
        self.addCleanup(h.close)
        runner.build_snapshot(c, provider, h, NOW, "sample")
        provider.fares["STL|DAD|SGN|economy|*"] = dict(provider.fares["STL|DAD|SGN|economy|*"], price_usd=1700)
        later = datetime(2026, 11, 3, 6, 0, 0)
        snap, _ = runner.build_snapshot(c, provider, h, later, "sample")
        econ = [r for r in all_rows(snap, "option2") if r["kind"] == "primary" and r["cabin"] == "economy"][0]
        self.assertEqual(econ["change"], {"usd": 300.0, "direction": "down"})
        self.assertTrue(econ["drop_flag"])  # 15% down
        self.assertEqual(econ["low_30d"], 1700)

    def test_budget_cap_stops_calls(self):
        c = cfg()
        c["max_calls_per_run"] = 2
        snap, calls, _ = self.run_it(c)
        self.assertEqual(calls, 2)
        reasons = [r["reason"] for r in all_rows(snap, "original")]
        self.assertIn("call budget reached", reasons)

    def test_configured_traveler_row(self):
        c = cfg()
        c["travelers"] = [{"name": "Test Person", "home_airport": "MCI"}]
        snap, _, _ = self.run_it(c)
        t = [r for r in all_rows(snap, "option2") if r["kind"] == "traveler"]
        self.assertEqual(len(t), 1)
        self.assertEqual(t[0]["traveler_name"], "Test Person")
        self.assertEqual(t[0]["origin"], "MCI")


class ConfigTests(unittest.TestCase):
    def test_shipped_config_is_valid_with_no_invented_travelers(self):
        c = cfg()
        self.assertEqual(c["travelers"], [])

    def test_validation_errors(self):
        base = cfg()
        for mutate, text in [
            (lambda c: c.update(home_airport="stl"), "home_airport"),
            (lambda c: c["thresholds"].update(shift_usd=-1), "shift_usd"),
            (lambda c: c["schedule"].update(time="25:00"), "schedule.time"),
            (lambda c: c.update(travelers=[{"name": "", "home_airport": "MCI"}]), "name"),
            (lambda c: c.update(travelers=[{"name": "A", "home_airport": "KANSAS"}]), "home_airport"),
            (lambda c: c["itineraries"]["option2"].update(return_date="2027-11-01"), "return_date"),
        ]:
            c = copy.deepcopy(base)
            mutate(c)
            with self.assertRaises(config_mod.ConfigError) as ctx:
                config_mod.validate(c)
            self.assertIn(text, str(ctx.exception))


class OutputTests(unittest.TestCase):
    def test_cli_no_key_writes_valid_files(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("SERPAPI_API_KEY", None)
            with mock.patch.object(run_monitor, "load_env_file"):
                self.assertEqual(run_monitor.main(["--output-dir", d]), 0)
            with open(os.path.join(d, "latest.json"), encoding="utf-8") as fh:
                snap = json.load(fh)
            self.assertEqual(snap["mode"], "no_api_key")
            with open(os.path.join(d, "latest.js"), encoding="utf-8") as fh:
                js = fh.read()
            m = re.fullmatch(r"window\.FLIGHT_MONITOR_DATA = (.*);\n", js, re.S)
            self.assertIsNotNone(m)
            self.assertEqual(json.loads(m.group(1)), snap)

    def test_cli_dry_run_writes_nothing(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(run_monitor.main(["--dry-run", "--output-dir", d]), 0)
            self.assertEqual(os.listdir(d), [])

    def test_cli_mock_goes_to_given_dir_and_is_labelled(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(run_monitor.main(["--mock", FIXTURE, "--output-dir", d]), 0)
            with open(os.path.join(d, "latest.json"), encoding="utf-8") as fh:
                self.assertEqual(json.load(fh)["mode"], "sample")

    def test_bad_config_exit_code(self):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, "bad.json")
            with open(p, "w") as fh:
                fh.write("{}")
            self.assertEqual(run_monitor.main(["--config", p]), 2)


if __name__ == "__main__":
    unittest.main()
