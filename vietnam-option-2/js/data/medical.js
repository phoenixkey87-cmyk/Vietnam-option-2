window.VO2_DATA = window.VO2_DATA || {};
// Medical, dental and beauty providers in Ho Chi Minh City. Informational only; not medical advice.
// Accreditation (JCI) is stated only where the provider's own site says so. Prices are null (none verified).
window.VO2_DATA.medicalDisclaimer = {
  general: "This section is informational and is not medical advice. Provider details must be confirmed directly. Only a licensed clinician can decide whether any test or treatment is suitable.",
  metformin: "The traveller takes metformin. Discuss this medication and your full medical history with every treating clinician before any exam, procedure or aesthetic treatment.",
  bodyContouring: "Noninvasive body contouring does not guarantee results. Eligibility, expected outcomes, recovery and scheduling require medical confirmation after an in-person consultation. Nothing is booked until a physician advises.",
  separation: "Medical services (physical exam, dental, physician-led aesthetic care) are different from cosmetic spa services (massage, facials). They are listed separately."
};
window.VO2_DATA.medical = [
  {
    id: "med-fv-hospital", city: "Ho Chi Minh City", name: "FV Hospital", category: "medical",
    status: "verified", sourceUrl: "https://www.fvhospital.com/en/who-we-are/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/medical/fv-hospital.jpg", imageAlt: "Exterior of FV Hospital, Ho Chi Minh City", imageNote: "Older photo of the hospital building.",
    location: "6 Nguyen Luong Bang, Tan My Ward (District 7)",
    credentials: { text: "States it has achieved JCI accreditation four consecutive times, from 2016 to the present.", status: "verified", sourceUrl: "https://www.fvhospital.com/en/who-we-are/" },
    services: ["Comprehensive health check-up", "Executive health check-up programme", "Optional add-ons such as dental exams (per FV news page)"],
    serviceNotes: "The executive programme is described as a one-day, closed check-up with consultations, cardiovascular imaging, eye assessment and an extended blood panel. Contents differ between programmes.",
    price: null, duration: "Check-ups can be completed in a single day per the hospital (package dependent).", consultation: "Appointment required. Phone: (84-28) 35 11 33 33, Mon to Fri 8:00 to 17:00, Sat 8:00 to 12:00 (as listed).",
    recovery: "Not applicable to routine check-ups.",
    bookingUrl: "https://www.fvhospital.com/en/make-an-appointment/",
    bookingLinks: [
      { kind: "book", via: "official", url: "https://www.fvhospital.com/en/make-an-appointment/", check: "fetched", checkedDate: "2026-11-02", note: "Official appointment page." }
    ], officialUrl: "https://www.fvhospital.com/en/",
    programUrl: "https://www.fvhospital.com/en/health-programme/executive-health-check-up-programme/",
    mapQuery: "FV Hospital, 6 Nguyen Luong Bang, Ho Chi Minh City",
    note: "Candidate for the Nov 25 physical. Confirm the package, a date and price. Mention metformin."
  },
  {
    id: "med-hcmc-dental", city: "Ho Chi Minh City", name: "HCMC Dental Clinic (District 1)", category: "dental",
    status: "estimated", sourceUrl: "https://hcmcdental.com/dentist-district-1-saigon/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/general/city-hall.jpg", imageAlt: "Ho Chi Minh City Hall in District 1", imageNote: "District 1 landmark photo; not the clinic.",
    location: "District 1, Ho Chi Minh City (street address not confirmed here)",
    credentials: { text: "The clinic's own site describes international-standard care and English-speaking dentists. Operating licence and dentist registration were not independently verified.", status: "pending", sourceUrl: "https://hcmcdental.com/dentist-district-1-saigon/" },
    services: ["Routine teeth cleaning", "Dental exam"],
    serviceNotes: "Self-described on the clinic's marketing site. Verify licensing with the clinic before booking.",
    price: null, duration: null, consultation: "Contact the clinic to book a cleaning and exam.", recovery: "Not applicable to routine cleaning.",
    bookingUrl: null,
    bookingLinks: [
      { kind: "inquire", via: "official", url: "https://hcmcdental.com/contact/", check: "fetched", checkedDate: "2026-11-02" }
    ], officialUrl: "https://hcmcdental.com/",
    mapQuery: "HCMC Dental Clinic District 1 Ho Chi Minh City",
    note: "One candidate only. Compare with FV Hospital's dental option and ask each for licence details."
  },
  {
    id: "med-fmp-dermatology", city: "Ho Chi Minh City", name: "Family Medical Practice, Dermatology (Thao Dien)", category: "aesthetic-medical",
    status: "estimated", sourceUrl: "https://www.vietnammedicalpractice.com/clinical-services/dermatology/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/general/notre-dame.jpg", imageAlt: "Notre-Dame Cathedral Basilica of Saigon", imageNote: "City landmark photo; not the clinic.",
    location: "Thao Dien, Ho Chi Minh City (street address not confirmed here)",
    credentials: { text: "Dermatologists listed on the official services page. Licence and accreditation not verified here.", status: "pending", sourceUrl: "https://www.vietnammedicalpractice.com/clinical-services/dermatology/" },
    services: ["Dermatology consultation (skin, hair and nail conditions)"],
    serviceNotes: "The page lists medical dermatology. It does not confirm body-contouring or skin-tightening treatments; ask whether they are offered.",
    price: null, duration: null, consultation: "A physician consultation decides whether any noninvasive body contouring or skin tightening is suitable.", recovery: "Depends on the treatment and is set by the treating physician.",
    bookingUrl: null,
    bookingLinks: [
      { kind: "inquire", via: "official", url: "https://www.vietnammedicalpractice.com/contact-us/", check: "fetched", checkedDate: "2026-11-02" }
    ], officialUrl: "https://www.vietnammedicalpractice.com/",
    mapQuery: "Family Medical Practice Thao Dien Ho Chi Minh City",
    note: "Used as the proposed first consult on Nov 26. No outcome, price or availability is implied."
  },
  {
    id: "med-wedo-skin", city: "Ho Chi Minh City", name: "WEDO Skin Clinic", category: "aesthetic-medical",
    status: "estimated", sourceUrl: "https://wedoskinclinic.com/en/top-7-reputable-dermatology-clinics-hcmc", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/general/opera-house.jpg", imageAlt: "Saigon Opera House before sunrise", imageNote: "City landmark photo; not the clinic.",
    location: "Ho Chi Minh City (address not confirmed here)",
    credentials: { text: "Self-described dermatology and aesthetics clinic with a named dermatologist. Licence not verified.", status: "pending", sourceUrl: "https://wedoskinclinic.com/en/dermatologist-specialist-dr-hoa" },
    services: ["Skin rejuvenation", "Dermatology consultation"],
    serviceNotes: "Clinic content ranks itself first in its own list, so treat it as marketing. Ask which treatments exist for the abdomen and back and what the risks are.",
    price: null, duration: null, consultation: "Consultation required.", recovery: "Set by the treating physician.",
    bookingUrl: null,
    bookingLinks: [
      { kind: "inquire", via: "official", url: "https://wedoskinclinic.com/lien-he#book", check: "fetched", checkedDate: "2026-11-02", note: "Official contact and booking form; the page is in Vietnamese." }
    ], officialUrl: "https://wedoskinclinic.com/",
    mapQuery: "WEDO Skin Clinic Ho Chi Minh City",
    note: "Comparison candidate for Nov 26."
  },
  {
    id: "med-rr-beauty", city: "Ho Chi Minh City", name: "R&R Beauty Clinic", category: "aesthetic-medical",
    status: "estimated", sourceUrl: "https://www.rrbeautyclinic.com.vn/", checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/general/landmark-81.jpg", imageAlt: "Landmark 81 tower in Ho Chi Minh City", imageNote: "City landmark photo; not the clinic.",
    location: "Ho Chi Minh City (address not confirmed here)",
    credentials: { text: "Describes itself as a licensed aesthetic clinic offering non-surgical treatments, injectables and minor aesthetic surgery. Licence not independently verified.", status: "pending", sourceUrl: "https://www.rrbeautyclinic.com.vn/" },
    services: ["Non-surgical aesthetic treatments"],
    serviceNotes: "Also lists injectables and minor surgery. This trip only considers noninvasive options and only after physician advice.",
    price: null, duration: null, consultation: "Consultation required.", recovery: "Set by the treating physician.",
    bookingUrl: null,
    bookingLinks: [
      { kind: "book", via: "ota", otaName: "Fresha", url: "https://www.fresha.com/book-now/r-r-beauty-aesthetic-c6oihfhh/all-offer?share&pId=1293043", check: "fetched", checkedDate: "2026-11-02", note: "Fresha booking page linked from the clinic's own site. It redirects to the R&R Beauty Clinic listing in Thao Dien. Consultation first; no treatment is implied." }
    ], officialUrl: "https://www.rrbeautyclinic.com.vn/",
    mapQuery: "R&R Beauty Clinic Ho Chi Minh City",
    note: "Comparison candidate for Nov 26."
  },
  {
    id: "med-hotel-spa", city: "Ho Chi Minh City", name: "Hotel spas (massage and facials)", category: "spa",
    status: "proposed", sourceUrl: null, checkedDate: "2026-11-02",
    image: "vietnam-option-2/images/hotels/ben-thanh-market.jpg", imageAlt: "Ben Thanh Market area in District 1", imageNote: "District 1 photo; not a spa.",
    location: "Inside several shortlisted hotels",
    credentials: { text: "Cosmetic and relaxation services, not medical treatment.", status: "proposed", sourceUrl: null },
    services: ["Luxury massage", "Facial treatment"],
    serviceNotes: "Examples of hotels with spas: La Siesta Premium Saigon (La Spa) and Liberty Central Saigon Citypoint (The Spa). Menus and prices are pending.",
    price: null, duration: null, consultation: "Tell the spa about medications and any skin concerns.", recovery: "Not applicable.",
    bookingUrl: null, officialUrl: null, mapQuery: null,
    note: "Cosmetic spa service. Not a substitute for a physician's advice."
  }
];
