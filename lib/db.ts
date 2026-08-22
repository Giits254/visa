import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateUniqueReferenceCode } from "./reference-code";

export type ApplicationStatus =
  | "awaiting_payment"
  | "paid"
  | "submitted"
  | "payment_failed"
  | "payment_cancelled";

export type ApplicationRecord = {
  id: number;
  reference_code: string;
  status: ApplicationStatus;
  full_name: string;
  email: string;
  phone_country: string;
  phone: string;
  id_number: string;
  nationality: string;
  destination_code: string;
  destination_name: string;
  street: string | null;
  city: string | null;
  zip: string | null;
  state: string | null;
  travel_date: string | null;
  purpose: string | null;
  fee_usd: number;
  amount_kes: number;
  transaction_request_id: string | null;
  checkout_request_id: string | null;
  merchant_request_id: string | null;
  transaction_id: string | null;
  transaction_receipt: string | null;
  transaction_date: string | null;
  msisdn: string | null;
  payment_response_code: number | null;
  payment_response_description: string | null;
  created_at: string;
  paid_at: string | null;
  submitted_at: string | null;
};

async function db() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export type NewApplicationInput = {
  fullName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  idNumber: string;
  nationality: string;
  destinationCode: string;
  destinationName: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  travelDate: string;
  purpose: string;
  feeUsd: number;
  amountKes: number;
  transactionRequestId: string | null;
  checkoutRequestId: string | null;
  merchantRequestId: string | null;
};

/**
 * Creates the application row at the moment STK push is initiated — this is
 * "save the applicant's data up to that point," ahead of confirmed payment.
 * Status starts at 'awaiting_payment' and is flipped forward from there.
 *
 * Split into reserve + insert because we need the code *before* calling
 * Paywave (it's sent as the STK push reference), but only want a DB row
 * once we know the push itself was accepted.
 */
export async function reserveReferenceCode(): Promise<string> {
  const database = await db();
  return generateUniqueReferenceCode(async (code) => {
    const existing = await database
      .prepare("SELECT 1 FROM applications WHERE reference_code = ?")
      .bind(code)
      .first();
    return existing !== null;
  });
}

export async function insertApplication(referenceCode: string, input: NewApplicationInput): Promise<void> {
  const database = await db();

  await database
    .prepare(
      `INSERT INTO applications (
        reference_code, status, full_name, email, phone_country, phone, id_number,
        nationality, destination_code, destination_name, street, city, zip, state,
        travel_date, purpose, fee_usd, amount_kes,
        transaction_request_id, checkout_request_id, merchant_request_id
      ) VALUES (?, 'awaiting_payment', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      referenceCode,
      input.fullName,
      input.email,
      input.phoneCountry,
      input.phone,
      input.idNumber,
      input.nationality,
      input.destinationCode,
      input.destinationName,
      input.street,
      input.city,
      input.zip,
      input.state,
      input.travelDate,
      input.purpose,
      input.feeUsd,
      input.amountKes,
      input.transactionRequestId,
      input.checkoutRequestId,
      input.merchantRequestId
    )
    .run();
}

export type PaymentResult = {
  status: "paid" | "payment_failed" | "payment_cancelled";
  transactionId?: string | null;
  transactionReceipt?: string | null;
  transactionDate?: string | null;
  msisdn?: string | null;
  responseCode?: number | null;
  responseDescription?: string | null;
};

/**
 * Applies a payment outcome (from the Paywave callback, or a status-poll
 * fallback that called verifyPayment directly). Matches by reference_code
 * first (Paywave echoes it back as TransactionReference), falling back to
 * checkout_request_id / transaction_request_id for safety. Idempotent: once
 * an application is 'paid' or later, further "still pending" results are
 * ignored, and a repeat "paid" result is a harmless no-op.
 */
export async function recordPaymentResult(
  matchers: { referenceCode?: string | null; checkoutRequestId?: string | null; transactionRequestId?: string | null },
  result: PaymentResult
): Promise<ApplicationRecord | null> {
  const database = await db();

  let existing: ApplicationRecord | null = null;
  if (matchers.referenceCode) {
    existing = await database
      .prepare("SELECT * FROM applications WHERE reference_code = ?")
      .bind(matchers.referenceCode)
      .first<ApplicationRecord>();
  }
  if (!existing && matchers.checkoutRequestId) {
    existing = await database
      .prepare("SELECT * FROM applications WHERE checkout_request_id = ?")
      .bind(matchers.checkoutRequestId)
      .first<ApplicationRecord>();
  }
  if (!existing && matchers.transactionRequestId) {
    existing = await database
      .prepare("SELECT * FROM applications WHERE transaction_request_id = ?")
      .bind(matchers.transactionRequestId)
      .first<ApplicationRecord>();
  }
  if (!existing) return null;

  // Already settled — don't let a duplicate/late callback move it backwards.
  if (existing.status === "paid" || existing.status === "submitted") {
    return existing;
  }

  const paidAt = result.status === "paid" ? "datetime('now')" : "paid_at";
  await database
    .prepare(
      `UPDATE applications SET
        status = ?,
        transaction_id = COALESCE(?, transaction_id),
        transaction_receipt = COALESCE(?, transaction_receipt),
        transaction_date = COALESCE(?, transaction_date),
        msisdn = COALESCE(?, msisdn),
        payment_response_code = COALESCE(?, payment_response_code),
        payment_response_description = COALESCE(?, payment_response_description),
        paid_at = ${paidAt}
      WHERE id = ?`
    )
    .bind(
      result.status,
      result.transactionId ?? null,
      result.transactionReceipt ?? null,
      result.transactionDate ?? null,
      result.msisdn ?? null,
      result.responseCode ?? null,
      result.responseDescription ?? null,
      existing.id
    )
    .run();

  return await database
    .prepare("SELECT * FROM applications WHERE id = ?")
    .bind(existing.id)
    .first<ApplicationRecord>();
}

export async function getApplicationByReference(referenceCode: string): Promise<ApplicationRecord | null> {
  const database = await db();
  return await database
    .prepare("SELECT * FROM applications WHERE reference_code = ?")
    .bind(referenceCode.trim().toUpperCase())
    .first<ApplicationRecord>();
}

/** Used by the public "Already applied?" checker — accepts a reference
 * code, a Paywave TransactionID, or a TransactionReceipt (Safaricom code). */
export async function findApplicationByAnyCode(rawCode: string): Promise<ApplicationRecord | null> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;
  const database = await db();
  return await database
    .prepare(
      `SELECT * FROM applications
       WHERE UPPER(reference_code) = ?
          OR UPPER(transaction_id) = ?
          OR UPPER(transaction_receipt) = ?
       LIMIT 1`
    )
    .bind(code, code, code)
    .first<ApplicationRecord>();
}

export async function markSubmitted(referenceCode: string): Promise<ApplicationRecord | null> {
  const database = await db();
  await database
    .prepare(
      `UPDATE applications SET status = 'submitted', submitted_at = datetime('now')
       WHERE reference_code = ? AND status = 'paid'`
    )
    .bind(referenceCode)
    .run();
  return await getApplicationByReference(referenceCode);
}
