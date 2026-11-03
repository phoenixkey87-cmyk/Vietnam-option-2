"""Load and validate config.json with clear errors."""
import json
import re

IATA = re.compile(r"^[A-Z]{3}$")
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
CABINS = {"economy", "business", "first"}
KINDS = ("primary", "alternate", "traveler", "shift")


class ConfigError(ValueError):
    pass


def _iata(value, where):
    if not isinstance(value, str) or not IATA.match(value):
        raise ConfigError("%s must be a 3-letter uppercase IATA code, got %r" % (where, value))


def _positive(value, where):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value <= 0:
        raise ConfigError("%s must be a positive number, got %r" % (where, value))


def validate(cfg):
    if not isinstance(cfg, dict):
        raise ConfigError("config must be a JSON object")
    _iata(cfg.get("home_airport"), "home_airport")
    alts = cfg.get("alternate_origins", [])
    if not isinstance(alts, list):
        raise ConfigError("alternate_origins must be a list")
    for i, code in enumerate(alts):
        _iata(code, "alternate_origins[%d]" % i)
    th = cfg.get("thresholds")
    if not isinstance(th, dict):
        raise ConfigError("thresholds is required")
    for key in ("drop_pct", "shift_usd", "alt_origin_usd", "shift_days", "low_window_days"):
        _positive(th.get(key), "thresholds.%s" % key)
    cabins = cfg.get("cabins_by_kind")
    if not isinstance(cabins, dict):
        raise ConfigError("cabins_by_kind is required")
    for kind in KINDS:
        lst = cabins.get(kind)
        if not isinstance(lst, list) or not set(lst) <= CABINS:
            raise ConfigError("cabins_by_kind.%s must be a list of economy/business/first" % kind)
    _positive(cfg.get("max_calls_per_run"), "max_calls_per_run")
    _positive(cfg.get("shift_check_interval_days"), "shift_check_interval_days")
    sched = cfg.get("schedule")
    if not isinstance(sched, dict) or not TIME.match(str(sched.get("time", ""))):
        raise ConfigError("schedule.time must be HH:mm (24-hour), got %r" % (sched or {}).get("time"))
    travelers = cfg.get("travelers", [])
    if not isinstance(travelers, list):
        raise ConfigError("travelers must be a list")
    for i, t in enumerate(travelers):
        if not isinstance(t, dict) or not str(t.get("name", "")).strip():
            raise ConfigError("travelers[%d] needs a non-empty name" % i)
        _iata(t.get("home_airport"), "travelers[%d].home_airport" % i)
    itins = cfg.get("itineraries")
    if not isinstance(itins, dict) or not itins:
        raise ConfigError("itineraries is required")
    for key, it in itins.items():
        if not isinstance(it, dict):
            raise ConfigError("itineraries.%s must be an object" % key)
        _iata(it.get("arrive"), "itineraries.%s.arrive" % key)
        _iata(it.get("depart"), "itineraries.%s.depart" % key)
        for d in ("outbound_date", "return_date"):
            if not DATE.match(str(it.get(d, ""))):
                raise ConfigError("itineraries.%s.%s must be YYYY-MM-DD" % (key, d))
        if it["return_date"] <= it["outbound_date"]:
            raise ConfigError("itineraries.%s.return_date must be after outbound_date" % key)
        n = it.get("travelers")
        if n is not None and (isinstance(n, bool) or not isinstance(n, int) or n < 1):
            raise ConfigError("itineraries.%s.travelers must be a positive integer or null" % key)
    return cfg


def load(path):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            cfg = json.load(fh)
    except json.JSONDecodeError as exc:
        raise ConfigError("config is not valid JSON: %s" % exc)
    return validate(cfg)
