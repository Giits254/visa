// Thin wrapper around the Paywave Express STK push API
// (https://paywavexpress.co.ke/v1). Plain fetch — no axios dependency
// needed, and fetch runs fine in the Workers runtime.

export type StkPushResponse = {
  transaction_request_id: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  [key: string]: unknown;
};

export type TransactionStatusResponse = {
  // Docs describe these four; keep the type loose since Paywave may add
  // fields we don't rely on.
  status?: "Pending" | "Completed" | "Failed" | "Cancelled" | string;
  [key: string]: unknown;
};

async function paywaveRequest<T>(baseUrl: string, path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Paywave returned a non-JSON response (${response.status}): ${text.slice(0, 300)}`);
  }

  // Debug: log Paywave's ACTUAL raw response shape. Our field-name
  // assumptions (transaction_request_id, checkout_request_id, ...) came
  // from sample code, not confirmed live docs — this makes the real
  // response body visible in `wrangler tail` / Observability so those
  // assumptions can be checked against reality. api_key is only ever sent
  // in the request, never expected back, but stripped here just in case
  // some endpoint echoes the request body.
  const forLog =
    json && typeof json === "object" ? { ...(json as Record<string, unknown>) } : json;
  if (forLog && typeof forLog === "object" && "api_key" in forLog) {
    (forLog as Record<string, unknown>).api_key = "[redacted]";
  }
  console.log(`Paywave ${path} raw response (status ${response.status}):`, JSON.stringify(forLog));

  if (!response.ok) {
    const message =
      (json as { message?: string; error?: string })?.message ??
      (json as { message?: string; error?: string })?.error ??
      `Paywave request failed with status ${response.status}`;
    throw new Error(message);
  }

  // Confirmed via production logs: Paywave can return HTTP 200 on a
  // business-logic failure (e.g. {"ResultCode":"102","errorMessage":
  // "Request is missing required api_key!"}) instead of a non-2xx status.
  // Without this check that error body gets returned as if it were a
  // normal success payload, silently breaking everything downstream.
  //
  // IMPORTANT: don't try to guess which ResultCode means "success" — a
  // prior version of this check assumed "0"/"00", but production logs
  // showed a genuine success returns ResultCode 200 (HTTP-style, not the
  // "0 = ok" convention), which made that check reject real successes.
  // `errorMessage` presence is the one failure signal we've actually
  // confirmed, so key off that instead.
  const errorMessage = (json as { errorMessage?: string })?.errorMessage;
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return json as T;
}

export async function initiateStkPush(params: {
  baseUrl: string;
  apiKey: string;
  email: string;
  amount: number;
  msisdn: string;
  reference: string;
}): Promise<StkPushResponse> {
  return paywaveRequest<StkPushResponse>(params.baseUrl, "/stkpush", {
    api_key: params.apiKey,
    email: params.email,
    amount: String(params.amount),
    msisdn: params.msisdn,
    reference: params.reference,
  });
}

export async function verifyPaywaveTransaction(params: {
  baseUrl: string;
  apiKey: string;
  email: string;
  transactionRequestId: string;
}): Promise<TransactionStatusResponse> {
  return paywaveRequest<TransactionStatusResponse>(params.baseUrl, "/tstatus", {
    api_key: params.apiKey,
    email: params.email,
    transaction_request_id: params.transactionRequestId,
  });
}

/**
 * Converts a dial code ("+254") and locally-entered number ("0712345678" or
 * "712345678") into the digits-only MSISDN format M-Pesa/Paywave expect
 * (e.g. "254712345678").
 */
export function toMsisdn(dialCode: string, localNumber: string): string {
  const dialDigits = dialCode.replace(/\D/g, "");
  let local = localNumber.replace(/\D/g, "");
  if (local.startsWith("0")) local = local.slice(1);
  return `${dialDigits}${local}`;
}

export type NormalizedPaymentOutcome = {
  outcome: "pending" | "paid" | "failed" | "cancelled";
  transactionId: string | null;
  transactionReceipt: string | null;
  transactionDate: string | null;
  msisdn: string | null;
  responseCode: number | null;
  responseDescription: string | null;
  transactionReference: string | null;
  checkoutRequestId: string | null;
  merchantRequestId: string | null;
};

/**
 * Normalizes either shape of Paywave response we deal with — the
 * ResponseCode-style callback payload, and the status-field style
 * verifyPayment/tstatus response — into one consistent outcome.
 *
 * We don't have hard confirmation of the exact tstatus field names beyond
 * what Paywave's docs describe (a `status` string: Pending/Completed/
 * Failed/Cancelled) plus the same transaction fields as the callback, so
 * this reads defensively and falls back to "pending" rather than guessing.
 */
export function normalizePaywaveResult(payload: Record<string, unknown>): NormalizedPaymentOutcome {
  const get = (...keys: string[]) => {
    for (const key of keys) {
      if (payload[key] !== undefined && payload[key] !== null) return payload[key];
    }
    return null;
  };

  const responseCode = get("ResponseCode", "response_code");
  const statusField = get("status", "Status", "TransactionStatus");
  const responseDescription = get("ResponseDescription", "response_description", "message");

  let outcome: NormalizedPaymentOutcome["outcome"] = "pending";
  if (typeof statusField === "string") {
    const normalized = statusField.toLowerCase();
    if (normalized === "completed") outcome = "paid";
    else if (normalized === "failed") outcome = "failed";
    else if (normalized === "cancelled" || normalized === "canceled") outcome = "cancelled";
    else outcome = "pending";
  } else if (responseCode !== null) {
    const code = Number(responseCode);
    if (code === 0) outcome = "paid";
    else if (typeof responseDescription === "string" && /cancel/i.test(responseDescription)) outcome = "cancelled";
    else outcome = "failed";
  }

  return {
    outcome,
    transactionId: (get("TransactionID", "transaction_id") as string | null) ?? null,
    transactionReceipt: (get("TransactionReceipt", "transaction_receipt") as string | null) ?? null,
    transactionDate: (get("TransactionDate", "transaction_date") as string | null) ?? null,
    msisdn: (get("Msisdn", "msisdn") as string | null) ?? null,
    responseCode: responseCode === null ? null : Number(responseCode),
    responseDescription: (responseDescription as string | null) ?? null,
    transactionReference: (get("TransactionReference", "reference") as string | null) ?? null,
    checkoutRequestId: (get("CheckoutRequestID", "checkout_request_id") as string | null) ?? null,
    merchantRequestId: (get("MerchantRequestID", "merchant_request_id") as string | null) ?? null,
  };
}
