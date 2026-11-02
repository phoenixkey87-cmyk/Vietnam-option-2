window.VO2_DATA = window.VO2_DATA || {};
// Nightlife. Genre keys: rnb-90s2000s, oldschool, trap, afro, neosoul.
// No venue schedule below is confirmed for November 2027. genreMatch "approximate" means the source names a broad genre
// (e.g. "hip-hop", "R&B") without an era or sub-style, so the filter tag is a best fit only.
// Opening days/hours come from dated third-party guides unless stated. Entry fees, VIP and dress codes are null unless a source gives them.
window.VO2_DATA.nightlifeGenres = [
  { key: "rnb-90s2000s", label: "90s and 2000s R&B" },
  { key: "oldschool", label: "Old-school hip-hop" },
  { key: "trap", label: "Current hip-hop and trap" },
  { key: "afro", label: "Afrobeats and Amapiano" },
  { key: "neosoul", label: "Neo-soul" }
];
window.VO2_DATA.nightlife = [
  {
    id: "night-the-roof-danang", city: "Da Nang", name: "The Roof Da Nang",
    status: "verified", sourceUrl: "https://www.theroofdanang.com/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/dragon-bridge.jpg", imageAlt: "Dragon Bridge in Da Nang lit at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Rooftop bar and lounge", location: "3rd floor, 1A Vo Nguyen Giap, Son Tra, above East West Brewing, overlooking My Khe Beach",
    genres: [], genreMatch: null, genresText: null,
    themedNights: null, dressCode: null, entryFee: null, vip: null, hours: null,
    website: "https://www.theroofdanang.com/", instagram: null,
    bookingLinks: [
      { kind: "reserve", via: "official", url: "https://www.theroofdanang.com/book-a-table", check: "fetched", checkedDate: "2026-11-02", note: "Official table request form. Per the form, reservations run 2PM to 8PM and later arrivals are walk-in only." }
    ],
    mapQuery: "The Roof Da Nang, 1A Vo Nguyen Giap, Son Tra, Da Nang",
    note: "Location is confirmed on its website. Music styles, themed nights, fees and dress code could not be verified. Pending confirmation."
  },
  {
    id: "night-blends-danang", city: "Da Nang", name: "BLENDS Social Bar & Kitchen",
    status: "verified", sourceUrl: "https://danangleisure.com/events/matsuri-x-nie-x-noizay", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/han-river-night.jpg", imageAlt: "Han River promenade in Da Nang at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Bar and club dance floor", location: "49 Ngo Thi Si, My An, Ngu Hanh Son, Da Nang",
    genres: ["afro"], genreMatch: "approximate",
    genresText: "A July 2025 event post says guest DJs blend R&B, hip-hop, Amapiano and Afrobeats. Era or sub-style of R&B and hip-hop was not stated.",
    themedNights: { text: "'Matsuri' is described as a signature Friday party (July 18, 2025 post). Whether it runs in 2027 is unconfirmed.", status: "estimated", sourceUrl: "https://danangleisure.com/events/matsuri-x-nie-x-noizay" },
    dressCode: null, entryFee: null, vip: null,
    hours: { text: "Open Monday to Sunday from 6pm until late (per the 2025 event post)", status: "estimated", sourceUrl: "https://danangleisure.com/events/matsuri-x-nie-x-noizay" },
    website: "https://danangleisure.com/events/matsuri-x-nie-x-noizay", instagram: null,
    mapQuery: "Blends Social Bar & Kitchen, 49 Ngo Thi Si, My An, Da Nang",
    note: "No November 2027 lineup is confirmed."
  },
  {
    id: "night-sky36-danang", city: "Da Nang", name: "SKY36 (Novotel Danang Premier Han River)",
    status: "estimated", sourceUrl: "https://danangfantasticity.com/en/sky-bar-36/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hero/dragon-bridge-night.jpg", imageAlt: "Da Nang skyline and Dragon Bridge at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Rooftop club and lounge", location: "35th to 37th floors, Novotel Danang Premier Han River, 36 Bach Dang",
    genres: ["trap", "rnb-90s2000s"], genreMatch: "approximate",
    genresText: "City tourism page lists Hip-Hop, EDM and R&B. Eras not stated.",
    themedNights: null,
    dressCode: { text: "Smart casual", status: "estimated", sourceUrl: "https://danangfantasticity.com/en/sky-bar-36/" },
    entryFee: null, vip: null,
    hours: { text: "18:00 to 02:00 (listed; page date unclear)", status: "estimated", sourceUrl: "https://danangfantasticity.com/en/sky-bar-36/" },
    ageLimit: "18+ (listed)",
    website: null, instagram: null,
    mapQuery: "SKY36 Novotel Danang Premier Han River, 36 Bach Dang, Da Nang",
    note: "The tourism page appears older; reconfirm that it is still operating with these hours."
  },
  {
    id: "night-weeknd-sgn", city: "Ho Chi Minh City", name: "Weeknd SGN",
    status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/nguyen-hue-night.jpg", imageAlt: "Nguyen Hue Walking Street lit up at night",
    imageNote: "Street photo about 3 minutes' walk from the club; not the venue.",
    venueType: "Hip-hop club, about 300 capacity", location: "66 Huynh Thuc Khang, central Ho Chi Minh City, about 3 minutes' walk from Nguyen Hue",
    genres: ["trap", "rnb-90s2000s"], genreMatch: "approximate",
    genresText: "A 2026 guide lists hip-hop and R&B. Eras not stated.",
    themedNights: null,
    dressCode: null,
    entryFee: null,
    tableInfo: { text: "Guide reports standard-sofa packages from about VND 6 million before VAT and service charge. Confirm with the club.", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    vip: "Table service model; reserve through the club.",
    hours: { text: "Friday to Sunday, 22:00 to 05:00 (guide). Nov 28, 2027 is a Sunday.", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    website: null, instagram: null,
    mapQuery: "Weeknd SGN, 66 Huynh Thuc Khang, Ho Chi Minh City",
    note: "Listed from a single dated third-party guide; no official site found. Confirm it is open and its schedule near the date."
  },
  {
    id: "night-loco-complex", city: "Ho Chi Minh City", name: "LOCO Complex",
    status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/saigon-night-2015.jpg", imageAlt: "Ho Chi Minh City streets and towers at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Two-floor club, about 300 capacity", location: "11 Nam Quoc Cang, Ben Thanh Ward, central Ho Chi Minh City",
    genres: ["trap", "rnb-90s2000s"], genreMatch: "approximate",
    genresText: "Guide: first floor hip-hop and R&B; upstairs Heatroom Top 40, EDM and House.",
    themedNights: null, dressCode: null, entryFee: null,
    tableInfo: { text: "Guide reports table minimums from about VND 3.5 million, excluding VAT and service charge. Confirm with the club.", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    vip: "Table-oriented; VIP zones exist per the guide.",
    hours: { text: "Tuesday to Sunday, 22:00 to 05:00 (guide)", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    website: null, instagram: null,
    mapQuery: "LOCO Complex, 11 Nam Quoc Cang, Ho Chi Minh City",
    note: "Address also appears on Songkick. No official site found."
  },
  {
    id: "night-cur8-saigon", city: "Ho Chi Minh City", name: "CUR8 Saigon",
    status: "pending", sourceUrl: null, checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hero/saigon-night.jpg", imageAlt: "Ho Chi Minh City skyline at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Unverified", location: null,
    genres: [], genreMatch: null, genresText: null,
    themedNights: null, dressCode: null, entryFee: null, vip: null, hours: null,
    website: null, instagram: null, mapQuery: null,
    unverifiable: true,
    note: "Could not find a current, reliable listing for this venue under this name. It may be closed, renamed or spelled differently. Pending confirmation before any plans."
  },
  {
    id: "night-neighborhood-saigon", city: "Ho Chi Minh City", name: "Neighborhood Saigon",
    status: "pending", sourceUrl: null, checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/nguyen-hue-night.jpg", imageAlt: "Nguyen Hue Walking Street at night",
    imageNote: "Street photo; not the venue.",
    venueType: "Unverified", location: null,
    genres: [], genreMatch: null, genresText: null,
    themedNights: null, dressCode: null, entryFee: null, vip: null, hours: null,
    website: null, instagram: null, mapQuery: null,
    unverifiable: true,
    note: "Could not find a current, reliable listing for this venue under this name. It may be closed, renamed or spelled differently. Pending confirmation before any plans."
  },
  {
    id: "night-bam-bam", city: "Ho Chi Minh City", name: "Bam Bam Tropical Club",
    status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/saigon-night-2015.jpg", imageAlt: "Ho Chi Minh City at night",
    imageNote: "City night photo; not the venue.",
    venueType: "Hip-hop club", location: "41-43 Nam Ky Khoi Nghia, central Ho Chi Minh City, about 7 minutes' walk from Ben Thanh Market",
    genres: ["trap"], genreMatch: "approximate", genresText: "Guide: hip-hop and current commercial tracks.",
    themedNights: { text: "Guide mentions recurring themed nights without naming them.", status: "pending", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    dressCode: { text: "Smart casual; no flip-flops or sports shorts (guide)", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    entryFee: null, vip: "Sofas and VIP areas per the guide.",
    hours: { text: "19:00 to 02:00 nightly (guide)", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    website: null, instagram: null,
    mapQuery: "Bam Bam Tropical Club, 41-43 Nam Ky Khoi Nghia, Ho Chi Minh City",
    note: "Alternative on nights when Weeknd SGN is closed."
  },
  {
    id: "night-papi-club", city: "Ho Chi Minh City", name: "PAPI Club Saigon",
    status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/nightlife/nguyen-hue-night.jpg", imageAlt: "Central Ho Chi Minh City at night",
    imageNote: "Street photo; not the venue.",
    venueType: "Upscale commercial club, about 300 capacity", location: "123 Le Loi, Ben Thanh Ward, central Ho Chi Minh City",
    genres: ["trap"], genreMatch: "approximate", genresText: "Guide: hip-hop, EDM and House.",
    themedNights: null,
    dressCode: { text: "Smart elegant; avoid shorts, tank tops and flip-flops (guide)", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    entryFee: null, vip: "Table tiers; confirm minimum spend, VAT and service charge before agreeing.",
    hours: { text: "22:00 to 04:00 daily (guide)", status: "estimated", sourceUrl: "https://www.vietnamparadisetravel.com/blog/best-night-clubs-in-ho-chi-minh-city-for-tourists" },
    website: "https://thepapisaigon.com/", instagram: null,
    bookingLinks: [
      { kind: "reserve", via: "official", url: "https://thepapisaigon.com/reservations", check: "fetched", checkedDate: "2026-11-02", note: "Official reservation form (VIP, bar and social seating). The venue confirms by phone; address on the site is 123 Le Loi." }
    ],
    mapQuery: "PAPI Club Saigon, 123 Le Loi, Ho Chi Minh City",
    note: "Central option near Ben Thanh."
  }
];
