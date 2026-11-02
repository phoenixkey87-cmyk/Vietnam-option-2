window.VO2_DATA = window.VO2_DATA || {};
// Hotels. Budget cap: USD 170 per room per night, one room per traveller preferred.
// rate.planningUsd is a PROPOSED planning figure under the cap, NOT a quote or availability check.
// Nights: Da Nang 3 (Nov 21-24), Ho Chi Minh City 5 (Nov 24-29).
// Photos show the area/neighbourhood (licensed Commons photos), not the hotel itself, unless stated.
window.VO2_DATA.hotelsMeta = {
  capUsdPerNight: 170,
  nights: { "Da Nang": 3, "Ho Chi Minh City": 5 },
  rateNote: "Planning rates are estimates under the USD 170 cap. Rates for Nov 2027 are confirmed at booking; use each hotel's booking links.",
  checkedDate: "2026-11-02"
};
window.VO2_DATA.hotels = [
  {
    id: "hotel-haian-beach", city: "Da Nang", name: "HAIAN Beach Hotel & Spa",
    status: "estimated", sourceUrl: "https://www.booking.com/hotel/vn/hai-an-beach-amp-spa.html", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/my-khe-hotels.jpg",
    imageAlt: "Beachfront high-rise hotels along My Khe Beach in Da Nang",
    imageNote: "Area photo of hotels along My Khe Beach; not necessarily this hotel.",
    stars: 4, starsStatus: "reported", starsSource: "https://haian-beach-spa.hotelsdanang.com/",
    starsNote: "4-star per a booking aggregator; the hotel's own site does not state a class.",
    address: "278 Vo Nguyen Giap, Da Nang", neighborhood: "My Khe Beach", beachfront: true, district1: false,
    amenities: ["Infinity rooftop pool", "Spa", "Poolside bar", "Restaurant (Ca Go, Vietnamese)", "Free bicycle rental"],
    pool: true, spa: true,
    amenitiesSource: "https://www.booking.com/hotel/vn/hai-an-beach-amp-spa.html",
    distances: [
      { to: "My Khe Beach", value: "About 1 to 5 minute walk (listings differ)", sourceUrl: "https://www.booking.com/hotel/vn/hai-an-beach-amp-spa.html" },
      { to: "Han Market", value: null, sourceUrl: null },
      { to: "Marble Mountains", value: null, sourceUrl: null }
    ],
    rate: { planningUsd: 120, status: "proposed", note: "Proposed planning figure under the USD 170 cap; no live quote." },
    review: { score: 9.4, scale: 10, basis: "Booking.com location sub-score, not an overall score", source: "Booking.com", sourceUrl: "https://www.booking.com/hotel/vn/hai-an-beach-amp-spa.fr.html", date: "2026-11-02", status: "estimated" },
    officialUrl: "https://haianbeachhotelspa.com/", bookingUrl: null,
    bookingLinks: [
      { kind: "inquire", via: "official", url: "https://haianbeachhotelspa.com/", check: "fetched", checkedDate: "2026-11-02", note: "Official HAIAN Beach Hotel Spa, Danang site." },
      { kind: "book", via: "ota", otaName: "Booking.com", url: "https://www.booking.com/hotel/vn/hai-an-beach-amp-spa.html", check: "unverified-by-bot", checkedDate: "2026-11-02", note: "Booking.com blocks automated checks. Search results show this page is HAIAN Beach Hotel & Spa, 278 Vo Nguyen Giap, Da Nang." }
    ]
  },
  {
    id: "hotel-tms-danang-beach", city: "Da Nang", name: "TMS Hotel Da Nang Beach",
    status: "verified", sourceUrl: "https://tmshotel.vn/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/my-khe-highrises.jpg",
    imageAlt: "High-rise hotels and the shoreline of My Khe Beach, Da Nang",
    imageNote: "Area photo of My Khe Beach; not necessarily this hotel.",
    stars: 5, starsStatus: "reported", starsSource: "https://tms-beach.hotelsdanang.com/",
    starsNote: "5-star per booking aggregators; the hotel's site does not state a star class.",
    address: "292 Vo Nguyen Giap, Da Nang", neighborhood: "My Khe Beach", beachfront: true, district1: false,
    amenities: ["Infinity rooftop pool on the 25th floor (6:00 to 20:00 daily)", "Spa (Melange, per Hotels.com)", "Poolside bar", "Suites with balconies and ocean or partial ocean views"],
    pool: true, spa: true,
    amenitiesSource: "https://tmshotel.vn/",
    distances: [
      { to: "My Khe Beach", value: "Across the road (per guest reviews on the hotel site)", sourceUrl: "https://tmshotel.vn/" },
      { to: "Han Market", value: "About 3.2 km", sourceUrl: "https://tms-beach.hotelsdanang.com/" },
      { to: "Marble Mountains", value: "About 5.5 km (3.4 miles)", sourceUrl: "https://tmsbeachdanang.vn-hotel.com/en/" }
    ],
    rate: { planningUsd: 130, status: "proposed", note: "Proposed planning figure under the USD 170 cap; no live quote." },
    observedRate: { text: "An aggregator snippet showed roughly S$105 for one night in March 2026. Single-date observation, not a quote.", sourceUrl: "https://sg.hotels.com/ho938033440/tms-hotel-da-nang-beach-da-nang-vietnam/", date: "2026-02-21", status: "estimated" },
    review: { score: null, scale: null, basis: "Rated 'Excellent' on Tripadvisor based on 1,812 reviews (no numeric score shown)", source: "Tripadvisor (as displayed on the hotel's website)", sourceUrl: "https://tmshotel.vn/", date: "2026-11-02", status: "verified" },
    officialUrl: "https://tmshotel.vn/", bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "ota", otaName: "Booking.com", url: "https://www.booking.com/hotel/vn/tms-luxury-danang-beach.html", check: "unverified-by-bot", checkedDate: "2026-11-02", note: "Booking.com blocks automated checks. Search results show this page is TMS Hotel Da Nang Beach. The hotel's own site has no stable booking page to link." }
    ]
  },
  {
    id: "hotel-fusion-resort-danang", city: "Da Nang", name: "Fusion Resort & Villas Da Nang",
    status: "estimated", sourceUrl: "https://fusionresorts.com/danang/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/my-khe-coastline.jpg",
    imageAlt: "The Da Nang coastline with sand and sea",
    imageNote: "Coastline photo for context; not this resort.",
    stars: 5, starsStatus: "reported", starsSource: "https://fusionandvillas.5starhotels.in/",
    starsNote: "5-star per booking aggregator listings; the official Fusion page does not state a star class.",
    address: "Along the coast between central Da Nang and Hoi An", neighborhood: "Non Nuoc coast (south of the city)", beachfront: true, district1: false,
    amenities: ["Wellness-inclusive concept (per official site)", "Daily yoga and meditation classes", "Spa (Maia Spa)", "Beach access"],
    pool: true, spa: true,
    amenitiesSource: "https://fusionresorts.com/danang/",
    distances: [
      { to: "Central Da Nang", value: "Roughly 10 minutes by car (travel magazine report)", sourceUrl: "https://www.cntraveler.com/hotels/da-nang/fusion-resort-and-villas-da-nang-wellness-inclusive" },
      { to: "Hoi An", value: "Between Da Nang and Hoi An", sourceUrl: "https://fusionresorts.com/danang/" }
    ],
    rate: { planningUsd: 150, status: "proposed", note: "Proposed planning figure; wellness-inclusive resort rates may approach the cap. Verify it fits USD 170." },
    review: null,
    officialUrl: "https://fusionresorts.com/danang/", bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "official", url: "https://villasdanang.backhotelite.com/en/bookcore/availability/fhrvdang/2027-11-21/2027-11-24/", check: "fetched", checkedDate: "2026-11-02", datesIncluded: "2027-11-21 to 2027-11-24", note: "Booking engine linked from the official Fusion page. The date path format was confirmed from the engine's own redirect; it responded for the 2027 dates, but availability must be checked there." },
      { kind: "inquire", via: "official", url: "https://fusionresorts.com/danang/contact/", check: "fetched", checkedDate: "2026-11-02" }
    ]
  },
  {
    id: "hotel-la-siesta-premium", city: "Ho Chi Minh City", name: "La Siesta Premium Saigon",
    status: "verified", sourceUrl: "https://lasiestapremiumsaigon.com/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/ly-tu-trong.jpg",
    imageAlt: "Ly Tu Trong street near Dong Khoi in central Ho Chi Minh City",
    imageNote: "Street photo from the hotel's neighbourhood; not the hotel.",
    stars: 5, starsStatus: "verified", starsSource: "https://lasiestapremiumsaigon.com/",
    starsNote: "The hotel's own site calls it a 5-star hotel.",
    address: "180-188 Ly Tu Trong, District 1", neighborhood: "District 1 (near Ben Thanh and Dong Khoi)", beachfront: false, district1: true,
    amenities: ["Twilight Sky Bar", "Cloud Nine restaurant", "La Spa Saigon", "Rooftop pool (per aggregator listings)", "Airport shuttle (per Hotels.com)"],
    pool: true, spa: true,
    amenitiesSource: "https://lasiestapremiumsaigon.com/",
    distances: [
      { to: "Takashimaya Vietnam", value: "Listed as a nearby point of interest", sourceUrl: "https://www.booking.com/hotel/vn/la-siesta-premium-sai-gon.html" },
      { to: "Ben Thanh Market", value: null, sourceUrl: null },
      { to: "Tan Son Nhat Airport", value: "About 7.2 km (4.5 miles)", sourceUrl: "https://zh.hotels.com/en/ho2855095936/la-siesta-premium-sai-gon-ho-chi-minh-city-vietnam/" }
    ],
    rate: { planningUsd: 150, status: "proposed", note: "Proposed planning figure under the USD 170 cap; no live quote." },
    review: { score: null, scale: null, basis: "Named in Tripadvisor Travellers' Choice Best of the Best 2026 (top 9 hotels in Vietnam), as announced by the hotel group", source: "Tripadvisor (via the hotel group's announcement)", sourceUrl: "https://lasiestahotels.com/saigon/tripadvisor-travelers-choice-awards-best-of-the-best-2026.html", date: "2026-11-02", status: "verified" },
    officialUrl: "https://lasiestapremiumsaigon.com/", bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "ota", otaName: "Booking.com", url: "https://www.booking.com/hotel/vn/la-siesta-premium-sai-gon.html", check: "unverified-by-bot", checkedDate: "2026-11-02", note: "Booking.com blocks automated checks. Search results show this page is La Siesta Premium Sai Gon, Ho Chi Minh City." },
      { kind: "inquire", via: "official", url: "https://lasiestapremiumsaigon.com/contact-us/", check: "fetched", checkedDate: "2026-11-02" }
    ]
  },
  {
    id: "hotel-silverland-ben-thanh", city: "Ho Chi Minh City", name: "Silverland Ben Thanh",
    status: "verified", sourceUrl: "https://silverlandhotels.com/boutique-hotel-near-ben-thanh-market/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/ben-thanh-market.jpg",
    imageAlt: "Ben Thanh Market building in Ho Chi Minh City",
    imageNote: "Photo of the neighbouring Ben Thanh Market; not the hotel.",
    stars: 4, starsStatus: "verified", starsSource: "https://silverlandhotels.com/boutique-hotel-near-ben-thanh-market/",
    starsNote: "Described as a four-star boutique hotel on the group's site.",
    address: "14-16 Le Lai, Ben Thanh Ward, District 1", neighborhood: "District 1 (beside Ben Thanh Market)", beachfront: false, district1: true,
    amenities: ["Rooftop pool", "Dining spaces", "Rooftop bar (per aggregator)", "Group spa brand: KL Spa"],
    pool: true, spa: null,
    amenitiesSource: "https://silverlandhotels.com/boutique-hotel-near-ben-thanh-market/",
    distances: [
      { to: "Ben Thanh Market", value: "About a 1 minute walk", sourceUrl: "https://silverlandhotels.com/boutique-hotel-near-ben-thanh-market/" },
      { to: "Notre-Dame Cathedral Basilica", value: "About 800 m", sourceUrl: "https://www.booking.com/hotel/vn/silverland-benthanh.html" }
    ],
    rate: { planningUsd: 100, status: "proposed", note: "Proposed planning figure under the USD 170 cap; no live quote." },
    review: null,
    officialUrl: "https://silverlandhotels.com/", bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "ota", otaName: "Booking.com", url: "https://www.booking.com/hotel/vn/silverland-benthanh.html", check: "unverified-by-bot", checkedDate: "2026-11-02", note: "Booking.com blocks automated checks. Search results show this page is Silverland Ben Thanh, 1 minute from Ben Thanh Market. The group's own booking engine searches several Silverland hotels, so it is not linked." },
      { kind: "inquire", via: "official", url: "https://silverlandhotels.com/contact-us", check: "fetched", checkedDate: "2026-11-02", note: "Silverland group contact page; name the Ben Thanh hotel in the message." }
    ],
    roomNote: "Official room list shows some categories (for example Spring Field) have no window. Choose a room with daylight."
  },
  {
    id: "hotel-liberty-central-citypoint", city: "Ho Chi Minh City", name: "Liberty Central Saigon Citypoint",
    status: "verified", sourceUrl: "https://www.libertycentralsaigoncitypoint.com", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/general/city-hall.jpg",
    imageAlt: "Ho Chi Minh City Hall, a central landmark in District 1",
    imageNote: "Photo of a nearby landmark; not the hotel.",
    stars: 4, starsStatus: "reported", starsSource: "https://liberty-central-saigon-citypoint.hochiminhhotels.com/",
    starsNote: "4-star per travel listings; official site does not state it in the text checked.",
    address: "Pasteur Street, District 1", neighborhood: "District 1", beachfront: false, district1: true,
    amenities: ["171 rooms and suites", "Infinity rooftop pool", "The Spa", "Above Sky Bar", "Restaurant"],
    pool: true, spa: true,
    amenitiesSource: "https://www.libertycentralsaigoncitypoint.com",
    distances: [
      { to: "Bitexco Financial Tower", value: "About 650 m", sourceUrl: "https://liberty-central-saigon-citypoint.ho-chi-minh-city-hotels.com/" },
      { to: "Ben Thanh Market", value: "Short walk (listing)", sourceUrl: "https://www.kayak.com/Ho-Chi-Minh-City-Hotels-Liberty-Central-Saigon-Citypoint.2180189.ksp" }
    ],
    rate: { planningUsd: 90, status: "proposed", note: "Proposed planning figure under the USD 170 cap; no live quote." },
    review: { score: 8.7, scale: 10, basis: "Booking.com score quoted by a third-party listing; may be out of date", source: "Booking.com (secondary listing)", sourceUrl: "https://libertycentralhochiminhcity.ohotel.com/", date: "2019-10-20", status: "estimated" },
    officialUrl: "https://www.libertycentralsaigoncitypoint.com", bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "official", url: "https://secure.odysseahotels.com/Booking-Engine/c98fb2a8-f837-4957-acca-4d61da20e3f3/", check: "fetched", checkedDate: "2026-11-02", note: "Booking engine linked from the hotel's official site. It is a script-driven page, so the property name was not read by the checker. No date parameters are known to work, so none are added." },
      { kind: "book", via: "ota", otaName: "Booking.com", url: "https://www.booking.com/hotel/vn/liberty-central-saigon-city-point.html", check: "unverified-by-bot", checkedDate: "2026-11-02", note: "Booking.com blocks automated checks. Search results show this page is Liberty Central Saigon Citypoint." },
      { kind: "inquire", via: "official", url: "https://www.libertycentralsaigoncitypoint.com/en/contact-us/", check: "fetched", checkedDate: "2026-11-02" }
    ]
  }
];
