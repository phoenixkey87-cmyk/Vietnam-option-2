import io
import json
import os
import unittest
import urllib.error
from unittest import mock

from fm.models import Query
from fm.providers import serpapi
from fm.providers.serpapi import SerpApiProvider

FIX = os.path.join(os.path.dirname(__file__), "fixtures")
KEY = "SECRETKEY123"


def load(name):
    with open(os.path.join(FIX, name), encoding="utf-8") as fh:
        return json.load(fh)


class FakeResp(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def resp(obj):
    return FakeResp(json.dumps(obj).encode("utf-8"))


def q(cabin="economy", arrive="DAD", depart="SGN"):
    return Query("option2", "STL", arrive, depart, "2027-11-20", "2027-11-29", cabin)


class SerpApiTests(unittest.TestCase):
    def provider(self):
        return SerpApiProvider(api_key=KEY)

    def test_ok_parse_picks_lowest_matching_cabin(self):
        with mock.patch.object(serpapi, "_urlopen", return_value=resp(load("serpapi_economy.json"))):
            fare = self.provider().search(q())
        self.assertEqual(fare.status, "ok")
        self.assertEqual(fare.price_usd, 1111.0)  # lowest Economy; the $500 Business result is ignored
        self.assertEqual(fare.airline, "CheapAir")
        self.assertEqual(fare.stops, 1)
        self.assertEqual(fare.duration_min, 1700)
        self.assertEqual(fare.layovers, ["SEA"])

    def test_api_key_never_in_booking_url(self):
        with mock.patch.object(serpapi, "_urlopen", return_value=resp(load("serpapi_economy.json"))):
            fare = self.provider().search(q())
        self.assertTrue(fare.booking_url.startswith("https://www.google.com/travel/flights"))
        self.assertNotIn(KEY, fare.booking_url)
        self.assertNotIn("api_key", fare.booking_url)

    def test_requested_first_but_only_business_returned_is_not_verified(self):
        with mock.patch.object(serpapi, "_urlopen", return_value=resp(load("serpapi_economy.json"))):
            fare = self.provider().search(q("first"))
        self.assertEqual(fare.status, "not_verified")
        self.assertIsNone(fare.price_usd)

    def test_http_errors_and_timeout_are_not_verified(self):
        err429 = urllib.error.HTTPError("u", 429, "Too Many", {}, None)
        for exc in (err429, urllib.error.URLError("boom"), TimeoutError()):
            with mock.patch.object(serpapi, "_urlopen", side_effect=exc):
                fare = self.provider().search(q())
            self.assertEqual(fare.status, "not_verified")
            self.assertIsNone(fare.price_usd)
            self.assertNotIn(KEY, fare.reason)

    def test_garbage_and_empty_are_not_verified(self):
        with mock.patch.object(serpapi, "_urlopen", return_value=FakeResp(b"not json")):
            self.assertEqual(self.provider().search(q()).status, "not_verified")
        with mock.patch.object(serpapi, "_urlopen", return_value=resp({})):
            self.assertEqual(self.provider().search(q()).status, "not_verified")
        with mock.patch.object(serpapi, "_urlopen", return_value=resp({"error": "Invalid API key"})):
            self.assertEqual(self.provider().search(q()).status, "not_verified")

    def test_explicit_no_results_is_empty(self):
        body = {"error": "Google Flights hasn't returned any results for this query."}
        with mock.patch.object(serpapi, "_urlopen", return_value=resp(body)):
            self.assertEqual(self.provider().search(q("first")).status, "empty")

    def test_no_key_makes_no_network_call(self):
        with mock.patch.object(serpapi, "_urlopen") as m:
            fare = SerpApiProvider(api_key="").search(q())
        m.assert_not_called()
        self.assertEqual(fare.status, "not_verified")
        self.assertEqual(fare.reason, "no API key")

    def test_open_jaw_uses_multi_city(self):
        p = self.provider().build_params(q(arrive="DAD", depart="SGN"))
        self.assertEqual(p["type"], 3)
        legs = json.loads(p["multi_city_json"])
        self.assertEqual([(l["departure_id"], l["arrival_id"]) for l in legs], [("STL", "DAD"), ("SGN", "STL")])

    def test_same_airport_uses_round_trip_and_cabin_codes(self):
        p = self.provider().build_params(q("first", arrive="HAN", depart="HAN"))
        self.assertEqual(p["type"], 1)
        self.assertEqual(p["travel_class"], 4)
        self.assertEqual(p["currency"], "USD")


if __name__ == "__main__":
    unittest.main()
