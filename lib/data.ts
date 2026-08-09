export type GulfCountry = {
  code: string;
  name: string;
  visaTypes: string[];
  avgProcessing: string;
  entryFee: string;
  notes: string;
};

export const gulfCountries: GulfCountry[] = [
  {
    code: "AE",
    name: "United Arab Emirates",
    visaTypes: ["Tourist (30-day)", "Tourist (60-day)", "Transit"],
    avgProcessing: "2–3 business days",
    entryFee: "From USD 90",
    notes: "Single- and multi-entry options available. Passport must be valid 6+ months.",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    visaTypes: ["Tourist (eVisa)", "Umrah", "Visit"],
    avgProcessing: "1–3 business days",
    entryFee: "From USD 120",
    notes: "eVisa covers tourism and permits multiple entries within one year.",
  },
  {
    code: "QA",
    name: "Qatar",
    visaTypes: ["Tourist", "Business Visit"],
    avgProcessing: "2–4 business days",
    entryFee: "From USD 60",
    notes: "Many nationalities qualify for visa-on-arrival; check eligibility before you fly.",
  },
  {
    code: "KW",
    name: "Kuwait",
    visaTypes: ["Tourist", "eVisa"],
    avgProcessing: "3–5 business days",
    entryFee: "From USD 100",
    notes: "eVisa applicants generally need proof of hotel booking and return ticket.",
  },
  {
    code: "BH",
    name: "Bahrain",
    visaTypes: ["eVisa", "Visa-on-arrival"],
    avgProcessing: "1–2 business days",
    entryFee: "From USD 75",
    notes: "One of the fastest Gulf approvals; extendable by 30 days from inside the country.",
  },
  {
    code: "OM",
    name: "Oman",
    visaTypes: ["Tourist eVisa", "Unsponsored Visit"],
    avgProcessing: "2–3 business days",
    entryFee: "From USD 70",
    notes: "10-day and 30-day options; unsponsored visa doesn't require a local host.",
  },
];

export const eligibleApplicantCountries = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Ethiopia",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Zambia",
  "Malawi",
  "India",
  "Philippines",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Indonesia",
];

export const coreRequirements = [
  {
    title: "Valid passport",
    detail: "Original passport with at least 6 months' validity remaining and 2 blank pages.",
  },
  {
    title: "Passport photo",
    detail: "Recent colour photo, white background, passport-size (varies slightly by country).",
  },
  {
    title: "Proof of accommodation",
    detail: "Hotel booking confirmation or a signed invitation letter from a host/sponsor.",
  },
  {
    title: "Return flight itinerary",
    detail: "A confirmed or reserved round-trip ticket showing your intended dates of travel.",
  },
  {
    title: "Bank statement",
    detail: "Last 3–6 months, showing sufficient funds to cover your stay.",
  },
  {
    title: "Travel insurance",
    detail: "Required for some destinations; covers medical emergencies during your visit.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Check eligibility",
    detail: "Tell us your nationality, destination and travel dates. We confirm the visa route that applies to you.",
  },
  {
    step: "02",
    title: "Prepare your documents",
    detail: "Follow the checklist generated for your specific case — no guesswork, no missing paperwork.",
  },
  {
    step: "03",
    title: "Submit your application",
    detail: "We review your documents for completeness before they're submitted, reducing rejection risk.",
  },
  {
    step: "04",
    title: "Track & receive",
    detail: "Follow your application status and get notified the moment your visa is issued.",
  },
];

export const tips = [
  {
    title: "Apply 2–3 weeks ahead",
    detail:
      "Standard processing is 1–3 business days, but public holidays, peak season (Hajj, Eid, Dec–Jan) and incomplete files can add time. Applying early leaves room for correction.",
  },
  {
    title: "Match your name exactly",
    detail: "Your name on every document — bank statement, booking, insurance — should match your passport exactly, including middle names.",
  },
  {
    title: "Keep bank statements recent",
    detail: "Most embassies want statements no older than 30 days at the time of submission, not at the time of travel.",
  },
  {
    title: "Don't book non-refundable flights first",
    detail: "Hold a reservation or use a refundable fare until your visa is approved, especially for first-time applicants.",
  },
  {
    title: "Scan documents in colour",
    detail: "Black-and-white or low-resolution scans are a common reason for delayed or rejected eVisa applications.",
  },
  {
    title: "Double check validity windows",
    detail: "A 30-day tourist visa usually means 30 days from entry, not 30 days from issue — plan your trip dates accordingly.",
  },
];

export const faqs = [
  {
    q: "How long does a Gulf visa actually take?",
    a: "Most Gulf tourist eVisas are processed in 1–3 business days once your file is complete. Saudi Arabia and Bahrain are often fastest; Kuwait can take up to 5 business days during busy periods. We recommend building in a buffer of at least 2 weeks before your travel date.",
  },
  {
    q: "Can I apply if I've been refused a visa before?",
    a: "Yes. A previous refusal doesn't automatically disqualify you, but it's worth understanding why it happened. Our eligibility check flags anything in your profile that commonly triggers refusals, such as short passport validity or unclear travel purpose.",
  },
  {
    q: "Do children need their own visa?",
    a: "Yes, every traveler needs an individual visa regardless of age, including infants. Children are usually included on a parent's application but still require their own passport and photo.",
  },
  {
    q: "What's the difference between an eVisa and visa-on-arrival?",
    a: "An eVisa is approved before you travel and linked electronically to your passport. Visa-on-arrival is issued at the airport on landing, but it's only available to certain nationalities and isn't guaranteed — we'll tell you which applies to you.",
  },
  {
    q: "Can I extend my visa once I'm in the country?",
    a: "Several Gulf countries (including Bahrain and Oman) allow a one-time extension from inside the country, usually for an additional fee. Extension rules vary by destination and visa type, so check the specific terms for your visa before relying on this.",
  },
  {
    q: "Do I need travel insurance?",
    a: "It's mandatory for some visa categories and strongly recommended for all of them. Insurance should cover medical treatment and repatriation for the full length of your stay.",
  },
  {
    q: "What happens if my application is rejected?",
    a: "You'll receive a reason where the issuing authority provides one. In most cases, you can correct the issue (documents, funds, itinerary) and reapply. Visa fees are typically non-refundable, which is why we review your file before submission.",
  },
];
