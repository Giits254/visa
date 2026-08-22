-- Freelance Visa applications database (Cloudflare D1 / SQLite).
--
-- One row per application. Created (status='awaiting_payment') the moment
-- someone taps "Make Payment" on step 3, with everything collected in
-- steps 1–2. The Paywave callback (or a status poll that falls back to
-- verifyPayment) flips it to 'paid' once M-Pesa confirms. Tapping
-- "Submit application" on the review step flips it to 'submitted' and
-- triggers the confirmation emails.
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- The single code applicants use everywhere: as the M-Pesa STK push
  -- reference, on their invoice, in their confirmation email, and to look
  -- up their status later.
  reference_code TEXT NOT NULL UNIQUE,

  status TEXT NOT NULL DEFAULT 'awaiting_payment' CHECK (
    status IN ('awaiting_payment', 'paid', 'submitted', 'payment_failed', 'payment_cancelled')
  ),

  -- Applicant details (steps 1–2)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_country TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number TEXT NOT NULL,
  nationality TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  street TEXT,
  city TEXT,
  zip TEXT,
  state TEXT,
  travel_date TEXT,
  purpose TEXT,

  -- Fee snapshot at the time payment was initiated
  fee_usd REAL NOT NULL,
  amount_kes INTEGER NOT NULL,

  -- Paywave / M-Pesa STK push tracking
  transaction_request_id TEXT,
  checkout_request_id TEXT,
  merchant_request_id TEXT,
  transaction_id TEXT,
  transaction_receipt TEXT,
  transaction_date TEXT,
  msisdn TEXT,
  payment_response_code INTEGER,
  payment_response_description TEXT,

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT,
  submitted_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_reference_code ON applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_applications_transaction_id ON applications(transaction_id);
CREATE INDEX IF NOT EXISTS idx_applications_transaction_receipt ON applications(transaction_receipt);
CREATE INDEX IF NOT EXISTS idx_applications_transaction_request_id ON applications(transaction_request_id);
