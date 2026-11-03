/* Flight Monitor renderer. Vanilla JS, shared by both itineraries.
 * Mount: <div data-flight-monitor data-itinerary="option2" data-origin="STL" data-arrive="DAD" data-depart="SGN"></div>
 * Data: window.FLIGHT_MONITOR_DATA (script tag, works from file://) then fetch('flight-monitor/data/latest.json').
 * Rules: prices are shown ONLY for status "ok" rows in a "live" snapshot. Everything else is "not verified".
 * All text goes through textContent. */
(function () {
  'use strict';

  var CABIN_LABEL = { economy: 'Economy', business: 'Business', first: 'First' };
  var JSON_URL = 'flight-monitor/data/latest.json';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function usd(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtDuration(min) {
    if (typeof min !== 'number' || !isFinite(min)) return 'not verified';
    return Math.floor(min / 60) + 'h ' + (min % 60) + 'm';
  }

  function fmtStops(n) {
    if (typeof n !== 'number') return 'not verified';
    return n === 0 ? 'Nonstop' : n + (n === 1 ? ' stop' : ' stops');
  }

  function fmtTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
      return d.toISOString();
    }
  }

  function fmtDate(iso) {
    var p = String(iso).split('-');
    if (p.length !== 3) return iso;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10);
  }

  function isHttps(u) {
    return typeof u === 'string' && /^https:\/\//i.test(u);
  }

  function globalPath(path) {
    var cur = window;
    var parts = String(path).split('.');
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function validSnapshot(s) {
    return !!(s && typeof s === 'object' && s.schema_version === 1 && s.itineraries && typeof s.itineraries === 'object');
  }

  /* Rows used when no usable snapshot exists: always "not verified". */
  function fallbackRows(mount) {
    var origin = mount.getAttribute('data-origin') || 'STL';
    var arrive = mount.getAttribute('data-arrive') || '';
    var depart = mount.getAttribute('data-depart') || '';
    var route = arrive === depart ? origin + ' \u21c4 ' + arrive : origin + ' \u2192 ' + arrive + ' / ' + depart + ' \u2192 ' + origin;
    return ['economy', 'business', 'first'].map(function (c) {
      return { id: 'fallback-' + c, route: route, origin: origin, kind: 'primary', cabin: c, status: 'not_verified', reason: 'no flight data loaded', checked_at: null };
    });
  }

  function badge(text, cls) {
    return el('li', 'fm-badge ' + cls, text);
  }

  function renderRow(row, ctx) {
    var live = ctx.live;
    var ok = live && row.status === 'ok' && typeof row.price_usd === 'number';
    var tr = el('tr', 'fm-row fm-kind-' + (row.kind || 'primary'));

    // Route
    var tdRoute = el('td');
    tdRoute.setAttribute('data-label', 'Route');
    tdRoute.appendChild(el('span', 'fm-route', row.route || ''));
    if (row.kind === 'traveler' && row.traveler_name) {
      tdRoute.appendChild(el('span', 'fm-sub', row.traveler_name + '\u2019s home airport'));
    } else if (row.kind === 'alternate') {
      tdRoute.appendChild(el('span', 'fm-sub', 'Alternate origin'));
    }
    tr.appendChild(tdRoute);

    // Cabin
    var tdCabin = el('td', null, CABIN_LABEL[row.cabin] || row.cabin);
    tdCabin.setAttribute('data-label', 'Cabin');
    tr.appendChild(tdCabin);

    if (ok) {
      var tdAir = el('td', null, row.airline || 'not verified');
      tdAir.setAttribute('data-label', 'Airline');
      tr.appendChild(tdAir);

      var tdStops = el('td', null, fmtStops(row.stops));
      tdStops.setAttribute('data-label', 'Stops');
      if (row.layovers && row.layovers.length) tdStops.appendChild(el('span', 'fm-sub', 'via ' + row.layovers.join(', ')));
      tr.appendChild(tdStops);

      var tdDur = el('td', null, fmtDuration(row.duration_min));
      tdDur.setAttribute('data-label', 'Duration');
      tr.appendChild(tdDur);
    } else {
      var notOffered = live && row.status === 'not_offered';
      var tdNote = el('td', 'fm-muted');
      tdNote.colSpan = 3;
      tdNote.setAttribute('data-label', 'Airline / stops / duration');
      tdNote.appendChild(el('span', null, notOffered ? 'Not offered on this route' : 'not verified'));
      if (!notOffered && row.reason && live) tdNote.appendChild(el('span', 'fm-sub', row.reason));
      tr.appendChild(tdNote);
    }

    // Price
    var tdPrice = el('td', 'fm-price');
    tdPrice.setAttribute('data-label', 'Price/person');
    if (ok) {
      var priceText = usd(row.price_usd);
      if (isHttps(row.booking_url)) {
        var a = el('a', 'fm-link', priceText);
        a.href = row.booking_url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(el('span', 'fm-sr', ' per person, view fare on Google Flights (opens in a new tab)'));
        tdPrice.appendChild(a);
      } else {
        tdPrice.appendChild(el('span', null, priceText));
      }
      tdPrice.appendChild(el('span', 'fm-sub', 'per person'));
      if (ctx.travelers > 1) tdPrice.appendChild(el('span', 'fm-sub', 'Group of ' + ctx.travelers + ': ' + usd(row.price_usd * ctx.travelers)));
      var badges = el('ul', 'fm-badges');
      var th = ctx.thresholds;
      if (row.drop_flag) badges.appendChild(badge('Drop over ' + th.drop_pct + '%', 'fm-b-drop'));
      if (row.shift && typeof row.shift.saving_usd === 'number') {
        badges.appendChild(badge('Save ' + usd(row.shift.saving_usd) + ' by shifting dates (' + fmtDate(row.shift.dates[0]) + '\u2013' + fmtDate(row.shift.dates[1]) + ')', 'fm-b-shift'));
      }
      if (row.alt_flag) badges.appendChild(badge('Cheaper origin: ' + row.origin + ' saves ' + usd(row.alt_saving_usd), 'fm-b-alt'));
      if (typeof row.low_30d === 'number') badges.appendChild(badge('30-day low ' + usd(row.low_30d), 'fm-b-low'));
      if (badges.childNodes.length) tdPrice.appendChild(badges);
    } else {
      tdPrice.appendChild(el('span', 'fm-muted', live && row.status === 'not_offered' ? 'Not offered' : 'not verified'));
    }
    tr.appendChild(tdPrice);

    // Change
    var tdChange = el('td');
    tdChange.setAttribute('data-label', 'Change');
    if (ok && row.change) {
      var c = row.change;
      if (c.direction === 'up') {
        var up = el('span', 'fm-up', '\u25b2 ' + usd(c.usd));
        up.setAttribute('aria-label', 'up ' + usd(c.usd));
        tdChange.appendChild(up);
      } else if (c.direction === 'down') {
        var dn = el('span', 'fm-down', '\u25bc ' + usd(c.usd));
        dn.setAttribute('aria-label', 'down ' + usd(c.usd));
        tdChange.appendChild(dn);
      } else {
        tdChange.appendChild(el('span', 'fm-muted', 'no change'));
      }
    } else {
      tdChange.appendChild(el('span', 'fm-muted', ok ? 'first check' : '\u2014'));
    }
    tr.appendChild(tdChange);

    // Checked
    var tdChecked = el('td');
    tdChecked.setAttribute('data-label', 'Checked');
    if (row.checked_at && live) {
      var t = el('time', null, fmtTime(row.checked_at));
      t.setAttribute('datetime', row.checked_at);
      tdChecked.appendChild(t);
    } else {
      tdChecked.appendChild(el('span', 'fm-muted', 'never checked'));
    }
    tr.appendChild(tdChecked);
    return tr;
  }

  function render(mount, snap, how) {
    var id = mount.getAttribute('data-itinerary');
    var itin = validSnapshot(snap) ? snap.itineraries[id] : null;
    var mode = itin ? snap.mode : 'missing';
    var live = mode === 'live';
    var rows = itin && Array.isArray(itin.rows) && itin.rows.length ? itin.rows : fallbackRows(mount);
    var thresholds = (snap && snap.thresholds) || { drop_pct: 10 };

    var travelers = itin && typeof itin.travelers === 'number' ? itin.travelers : 0;
    var globalSrc = mount.getAttribute('data-travelers-global');
    if (globalSrc) {
      var g = Number(globalPath(globalSrc));
      if (isFinite(g) && g >= 1) travelers = Math.floor(g);
    }

    mount.textContent = '';
    mount.classList.add('fm');

    // Meta: last checked + data source
    var meta = el('p', 'fm-meta');
    var last = live && snap.last_checked ? fmtTime(snap.last_checked) : 'Not checked yet';
    meta.appendChild(el('span', null, 'Last checked: '));
    if (live && snap.last_checked) {
      var tm = el('time', null, last);
      tm.setAttribute('datetime', snap.last_checked);
      meta.appendChild(tm);
    } else {
      meta.appendChild(document.createTextNode(last));
    }
    meta.appendChild(document.createTextNode(' \u00b7 Data source: '));
    var srcName = (snap && snap.source && snap.source.name) || 'SerpApi Google Flights';
    var srcUrl = (snap && snap.source && snap.source.url) || 'https://serpapi.com/google-flights-api';
    if (mode === 'sample') {
      meta.appendChild(document.createTextNode('none (sample data hidden)'));
    } else if (isHttps(srcUrl)) {
      var sa = el('a', 'fm-link', srcName);
      sa.href = srcUrl;
      sa.target = '_blank';
      sa.rel = 'noopener noreferrer';
      sa.appendChild(el('span', 'fm-sr', ' (opens in a new tab)'));
      meta.appendChild(sa);
    } else {
      meta.appendChild(document.createTextNode(srcName));
    }
    mount.appendChild(meta);

    var status = el('p', 'fm-status');
    status.setAttribute('aria-live', 'polite');
    if (mode === 'live') {
      status.textContent = 'Fares below were returned by the data source on the date shown. Anything the source did not return is marked not verified.';
    } else if (mode === 'sample') {
      status.textContent = 'This file contains sample data, so no prices are shown. All fares are not verified.';
    } else if (mode === 'no_api_key') {
      status.textContent = 'Live fare checks are not switched on yet (no API key has been set up), so every fare is not verified. No prices are estimated or invented.';
    } else {
      status.textContent = 'Flight data could not be loaded (the snapshot file is missing, empty, or blocked by the browser), so every fare is not verified. No prices are estimated or invented.';
    }
    mount.appendChild(status);

    var wrap = el('div', 'fm-table-wrap');
    var table = el('table', 'fm-table');
    var cap = el('caption', 'fm-sr', 'Lowest round-trip fare per person by route and cabin, with change since the last check');
    table.appendChild(cap);
    var thead = el('thead');
    var hr = el('tr');
    ['Route', 'Cabin', 'Airline', 'Stops', 'Duration', 'Price/person', 'Change', 'Checked'].forEach(function (h) {
      var th = el('th', null, h);
      th.setAttribute('scope', 'col');
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = el('tbody');
    var ctx = { live: live, travelers: travelers, thresholds: thresholds };
    rows.forEach(function (r) { tbody.appendChild(renderRow(r, ctx)); });
    table.appendChild(tbody);
    wrap.appendChild(table);
    mount.appendChild(wrap);

    var note = el('p', 'fm-note');
    var dates = itin ? 'Dates priced: depart ' + fmtDate(itin.outbound_date) + ', return ' + fmtDate(itin.return_date) + ' (assumed). ' : '';
    note.textContent = dates + 'Prices are per person, in USD, taxes included, and shown only when the data source returned them. Airline, stops, duration and layovers describe the outbound trip; the price covers the round trip (open-jaw where arrival and departure airports differ). The link opens a Google Flights search, so the fare there can differ. Alternate origins appear only when at least $' + (thresholds.alt_origin_usd || 300) + ' cheaper than STL.';
    mount.appendChild(note);
    mount.setAttribute('data-fm-state', how || mode);
  }

  function mountOne(mount) {
    render(mount, window.FLIGHT_MONITOR_DATA, 'embedded');
    if (typeof fetch !== 'function') return;
    fetch(JSON_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (data) {
        if (!validSnapshot(data)) return;
        var cur = window.FLIGHT_MONITOR_DATA;
        if (!validSnapshot(cur) || String(data.generated_at) >= String(cur.generated_at)) {
          window.FLIGHT_MONITOR_DATA = data;
          render(mount, data, 'fetched');
        }
      })
      .catch(function () { /* file:// or offline: keep the embedded/fallback rendering */ });
  }

  function init() {
    var mounts = document.querySelectorAll('[data-flight-monitor]');
    for (var i = 0; i < mounts.length; i++) mountOne(mounts[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
