export const BRAND_NAME = "Freelance Visa";

export const PROCESSING_FEE_USD = 100;
export const PROCESSING_FEE_LABEL = "Freelance Visa Processing Fee";
export const MPESA_TILL_NUMBER = "867 567";

export const freelanceVisaDefinition = {
  heading: "What is a Freelance Visa?",
  body:
    "A Freelance Visa is a Gulf residency and entry visa that allows you to legally live in your destination country while working for clients or employers elsewhere — fully online, hybrid, or fully onsite, in whatever mix suits your work. Unlike a standard work visa, it does not require local sponsorship or an in-country employer, and unlike a tourist visa, it permits you to earn income while you're there.",
};

export type GulfCountry = {
  code: string;
  name: string;
  visaLabel: string;
  validity: string;
  avgProcessing: string;
  notes: string;
};

export const gulfCountries: GulfCountry[] = [
  {
    code: "AE",
    name: "United Arab Emirates",
    visaLabel: "Freelance Visa (Virtual Working / Remote)",
    validity: "12 months, renewable",
    avgProcessing: "2–3 business days",
    notes: "Covers fully online work for a foreign employer, hybrid arrangements, and fully onsite freelance work. Passport must be valid 6+ months.",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    visaLabel: "Freelance Visa (eVisa route)",
    validity: "12 months, multiple entry",
    avgProcessing: "1–3 business days",
    notes: "Freelance work permitted alongside eVisa entry for eligible nationalities and professions.",
  },
  {
    code: "QA",
    name: "Qatar",
    visaLabel: "Freelance Visa (Remote Work)",
    validity: "12 months",
    avgProcessing: "2–4 business days",
    notes: "Supports fully online freelance work, hybrid arrangements, and fully onsite work with local clients.",
  },
  {
    code: "KW",
    name: "Kuwait",
    visaLabel: "Freelance Visa (eVisa)",
    validity: "90 days, extendable",
    avgProcessing: "3–5 business days",
    notes: "Applicants generally need proof of ongoing freelance income and a confirmed address.",
  },
  {
    code: "BH",
    name: "Bahrain",
    visaLabel: "Freelance Visa (Digital Worker)",
    validity: "12 months, renewable",
    avgProcessing: "1–2 business days",
    notes: "One of the fastest Freelance Visa approvals in the Gulf; extendable from inside the country.",
  },
  {
    code: "OM",
    name: "Oman",
    visaLabel: "Freelance Visa (Unsponsored Remote Work)",
    validity: "12 months",
    avgProcessing: "2–3 business days",
    notes: "Unsponsored route — no local host or employer required for eligible freelancers.",
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
  "Australia",
];

export const coreRequirements = [
  {
    title: "Passport photo",
    detail: "A recent, colour passport photo on a white background.",
  },
  {
    title: "Phone number",
    detail: "An active phone number we can reach you on for verification and updates.",
  },
  {
    title: "ID number",
    detail: "Your national ID or passport number, used to verify your identity.",
  },
  {
    title: "Physical address",
    detail: "Your current street address, including town/city and ZIP or postal code.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Check eligibility",
    detail: "Share a few details and we confirm the Freelance Visa route that applies to you.",
  },
  {
    step: "02",
    title: "Prepare your documents",
    detail: "Follow the checklist generated for your case — passport photo, ID, phone number and address.",
  },
  {
    step: "03",
    title: "Submit your application",
    detail: "We review your Freelance Visa application for completeness before it moves forward.",
  },
  {
    step: "04",
    title: "Pay the processing fee",
    detail: `A flat ${PROCESSING_FEE_LABEL} of $${PROCESSING_FEE_USD} USD applies to every Freelance Visa, paid via M-Pesa.`,
  },
  {
    step: "05",
    title: "Track & receive",
    detail: "Follow your Freelance Visa status and get notified the moment it's issued.",
  },
];

export const tips = [
  {
    title: "Apply 2–3 weeks ahead",
    detail:
      "Standard Freelance Visa processing is 1–3 business days after payment, but public holidays, peak season and incomplete files can add time. Applying early leaves room for correction.",
  },
  {
    title: "Match your name exactly",
    detail: "Your name on every document — ID, address proof, photo — should match your passport exactly, including middle names.",
  },
  {
    title: "Keep your ID details current",
    detail: "Make sure your ID number and phone number are active and correctly entered — this is how we verify and reach you about your Freelance Visa.",
  },
  {
    title: "Use a real, current address",
    detail: "Your physical address (street and ZIP/postal code) should be where you can reliably receive correspondence, not a temporary one.",
  },
  {
    title: "Scan documents in colour",
    detail: "Black-and-white or low-resolution photos are a common reason for delayed Freelance Visa applications.",
  },
  {
    title: "Keep your payment reference",
    detail: "Save the M-Pesa confirmation message and your Freelance Visa reference number until your application is fully processed.",
  },
];

export const faqs = [
  {
    q: "What exactly is a Freelance Visa?",
    a: "It's a visa that lets you legally live in a Gulf country while working — for clients or an employer elsewhere, fully online, or in a hybrid arrangement. It's built for remote and freelance workers rather than in-country employees, so it doesn't require local sponsorship.",
  },
  {
    q: "How long does a Freelance Visa take?",
    a: "Most Freelance Visas are processed in 1–3 business days once your file is complete and the processing fee is paid. Kuwait can take up to 5 business days during busy periods. We recommend building in a buffer of at least 2 weeks before your travel date.",
  },
  {
    q: "How much does a Freelance Visa cost?",
    a: `Every Freelance Visa, regardless of destination, has a flat Freelance Visa Processing Fee of $${PROCESSING_FEE_USD} USD, payable via M-Pesa once your application is submitted.`,
  },
  {
    q: "Can I work for a company back home on a Freelance Visa?",
    a: "Yes. That's the core purpose of the Freelance Visa — it explicitly permits earning income from clients or an employer outside the country, whether you work fully online, onsite, or in a hybrid mix of the two.",
  },
  {
    q: "What information do I need for the eligibility check?",
    a: "Your nationality, destination, purpose of travel, ID number and phone number. These let us confirm the Freelance Visa route that applies to you and generate your document checklist.",
  },
  {
    q: "How do I pay the processing fee?",
    a: "Currently via M-Pesa: after submitting your application, you'll see our Buy Goods till number and simple steps to complete payment. Bank and card payment are coming soon. Once paid, you'll receive a confirmation and a reference number for tracking.",
  },
  {
    q: "Can I cancel my application?",
    a: "Yes — see our Cancellation Policy for the timeline and any applicable refund terms. In general, cancelling before document review begins qualifies for a fuller refund than cancelling after submission to the relevant authority.",
  },
  {
    q: "What happens if my application is rejected?",
    a: "You'll receive a reason where the issuing authority provides one. In most cases, you can correct the issue and reapply. Refer to our Cancellation Policy for how this affects the processing fee.",
  },
];

export const cancellationPolicy = [
  {
    title: "Before document review",
    detail:
      "If you cancel your Freelance Visa application before our team begins reviewing your documents, you're eligible for a refund of the $100 USD processing fee, minus a $10 USD administrative charge.",
  },
  {
    title: "During document review",
    detail:
      "Once document review has started but before submission to the relevant Gulf authority, cancellations are eligible for a 50% refund of the processing fee.",
  },
  {
    title: "After submission to the authority",
    detail:
      "Once your Freelance Visa application has been submitted to the relevant embassy, immigration department, or issuing authority, the processing fee becomes non-refundable, as third-party processing costs have already been incurred.",
  },
  {
    title: "Rejected applications",
    detail:
      "If an application is rejected by the issuing authority for reasons outside your control (system error, processing fault), the processing fee is fully refunded. If rejected due to incomplete or inaccurate information you provided, standard cancellation terms above apply.",
  },
  {
    title: "How to request a cancellation",
    detail:
      "Email hello@freelancevisa.co with your reference number and reason for cancellation. Refunds, where applicable, are processed within 5–7 business days to the original M-Pesa number used for payment.",
  },
  {
    title: "Changes of destination",
    detail:
      "Requesting a change of destination country after payment is treated as a cancellation and new application. The original processing fee follows the cancellation terms above, and a new $100 USD fee applies to the new application.",
  },
];
