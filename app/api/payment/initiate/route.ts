import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { destinations, phoneCountries, USD_TO_KES_RATE } from "@/lib/data";
import { validatePhone, validateIdNumber } from "@/lib/validation";
import { initiateStkPush, toMsisdn } from "@/lib/paywave";
import { reserveReferenceCode, insertApplication } from "@/lib/db";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phoneCountry = String(body.phoneCountry ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const idNumber = String(body.idNumber ?? "").trim();
  const nationality = String(body.nationality ?? "").trim();
  const destinationCode = String(body.destinationCode ?? "").trim();
  const street = String(body.street ?? "").trim();
  const city = String(body.city ?? "").trim();
  const zip = String(body.zip ?? "").trim();
  const state = String(body.state ?? "").trim();
  const travelDate = String(body.travelDate ?? "").trim();
  const purpose = String(body.purpose ?? "").trim();

  const destination = destinations.find((d) => d.code === destinationCode);
  const dialCode = phoneCountries.find((c) => c.name === phoneCountry)?.dialCode;

  const phoneError = validatePhone(phone);
  const idError = validateIdNumber(idNumber);

  if (!fullName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid name and email." }, { status: 400 });
  }
  if (!nationality || !destination || !dialCode) {
    return NextResponse.json({ error: "Missing or invalid nationality/destination." }, { status: 400 });
  }
  if (phoneError) return NextResponse.json({ error: phoneError }, { status: 400 });
  if (idError) return NextResponse.json({ error: idError }, { status: 400 });
  if (destination.code === "AU" && !state) {
    return NextResponse.json({ error: "Select a state or territory." }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const feeUsd = destination.feeUSD;
  const amountKes = Math.round(feeUsd * USD_TO_KES_RATE);
  const msisdn = toMsisdn(dialCode, phone);

  const referenceCode = await reserveReferenceCode();

  let stkResponse;
  try {
    stkResponse = await initiateStkPush({
      baseUrl: env.PAYWAVE_BASE_URL,
      apiKey: env.PAYWAVE_API_KEY,
      email: env.PAYWAVE_EMAIL,
      amount: amountKes,
      msisdn,
      reference: referenceCode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not reach the payment provider.";
    return NextResponse.json({ error: `Payment could not be started: ${message}` }, { status: 502 });
  }

  await insertApplication(referenceCode, {
    fullName,
    email,
    phoneCountry,
    phone,
    idNumber,
    nationality,
    destinationCode: destination.code,
    destinationName: destination.name,
    street,
    city,
    zip,
    state,
    travelDate,
    purpose,
    feeUsd,
    amountKes,
    transactionRequestId: stkResponse.transaction_request_id ?? null,
    checkoutRequestId: stkResponse.checkout_request_id ?? null,
    merchantRequestId: stkResponse.merchant_request_id ?? null,
  });

  return NextResponse.json({
    referenceCode,
    transactionRequestId: stkResponse.transaction_request_id ?? null,
  });
}
