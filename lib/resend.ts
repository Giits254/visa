import { Resend } from "resend";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function resendClient() {
  const { env } = await getCloudflareContext({ async: true });
  return {
    resend: new Resend(env.RESEND_API_KEY),
    from: env.RESEND_FROM_EMAIL,
    platformEmail: env.PLATFORM_EMAIL,
  };
}

// The Resend SDK does NOT throw on a failed send (e.g. a 403 because the
// sending domain isn't verified yet) — it resolves with `{ data, error }`.
// Callers here only log-and-continue on failure (an email hiccup shouldn't
// block an already-paid application), so without this, failed sends would
// be silently swallowed. Check `wrangler tail` for these logs in production.
function logIfFailed(label: string, result: { data: unknown; error: unknown }) {
  if (result?.error) {
    console.error(`Resend send failed (${label}):`, result.error);
  }
  return result;
}

function shell(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3E9D7;font-family:Arial,Helvetica,sans-serif;color:#101B2D;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3E9D7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#1E3A4C;color:#F3E9D7;padding:24px 28px;">
                <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#C89B3C;">Freelance Visa</span>
                <h1 style="margin:6px 0 0;font-size:20px;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-size:14px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f7f2e7;font-size:11px;color:#6b7280;">
                Freelance Visa is an independent guidance and application service and is not affiliated with any embassy or consulate.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendApplicantConfirmationEmail(params: {
  to: string;
  fullName: string;
  referenceCode: string;
  destinationName: string;
  feeUsd: number;
  avgProcessing: string;
}) {
  const { resend, from } = await resendClient();
  const firstName = params.fullName.split(" ")[0] || "there";

  const html = shell(
    "Application submitted",
    `
    <p>Hi ${firstName},</p>
    <p>Your Freelance Visa application for <strong>${params.destinationName}</strong> has been submitted and payment of <strong>$${params.feeUsd.toFixed(
      2
    )} USD</strong> has been confirmed.</p>
    <p style="margin:20px 0;padding:16px;background:#f7f2e7;border-radius:10px;text-align:center;">
      <span style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;">Your reference / tracking code</span>
      <span style="display:block;margin-top:6px;font-size:20px;font-weight:700;letter-spacing:0.05em;font-family:monospace;color:#1E3A4C;">${params.referenceCode}</span>
    </p>
    <p>Keep this code — you'll use it to check your application status any time on our website ("Already applied?" in the menu). Typical processing for ${params.destinationName} is ${params.avgProcessing}.</p>
    <p>We'll be in touch at this email address with any updates.</p>
  `
  );

  return logIfFailed(
    "applicant confirmation",
    await resend.emails.send({
      from,
      to: params.to,
      subject: `Your Freelance Visa application — ${params.referenceCode}`,
      html,
    })
  );
}

export async function sendPlatformApplicationNotification(params: {
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  nationality: string;
  destinationName: string;
  street: string;
  city: string;
  zip: string;
  state?: string;
  travelDate: string;
  purpose: string;
  feeUsd: number;
  amountKes: number;
  transactionReceipt?: string | null;
  msisdn?: string | null;
  attachment?: { filename: string; contentBase64: string } | null;
}) {
  const { resend, from, platformEmail } = await resendClient();

  const rows: Array<[string, string]> = [
    ["Reference code", params.referenceCode],
    ["Full name", params.fullName],
    ["Email", params.email],
    ["Phone", params.phone],
    ["ID number", params.idNumber],
    ["Nationality", params.nationality],
    ["Destination", params.destinationName],
    ["Address", [params.street, params.city, params.zip].filter(Boolean).join(", ")],
    ...(params.state ? ([["State/territory", params.state]] as Array<[string, string]>) : []),
    ["Travel date", params.travelDate],
    ["Work style", params.purpose],
    ["Fee paid", `$${params.feeUsd.toFixed(2)} USD (≈ KES ${params.amountKes.toLocaleString()})`],
    ...(params.transactionReceipt ? ([["M-Pesa receipt", params.transactionReceipt]] as Array<[string, string]>) : []),
    ...(params.msisdn ? ([["Paid from", params.msisdn]] as Array<[string, string]>) : []),
  ];

  const html = shell(
    "New paid application submitted",
    `
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:6px 0;border-bottom:1px solid #eee;color:#6b7280;width:40%;">${label}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee;font-weight:600;">${value || "—"}</td>
        </tr>`
        )
        .join("")}
    </table>
  `
  );

  return logIfFailed(
    "platform application notification",
    await resend.emails.send({
      from,
      to: platformEmail,
      replyTo: params.email,
      subject: `New application — ${params.referenceCode} (${params.destinationName})`,
      html,
      attachments: params.attachment
        ? [{ filename: params.attachment.filename, content: params.attachment.contentBase64 }]
        : undefined,
    })
  );
}

export async function sendContactEmails(params: { name: string; email: string; message: string }) {
  const { resend, from, platformEmail } = await resendClient();

  const platformHtml = shell(
    "New contact message",
    `
    <p><strong>${params.name}</strong> (${params.email}) wrote:</p>
    <p style="white-space:pre-wrap;padding:14px;background:#f7f2e7;border-radius:10px;">${params.message}</p>
  `
  );

  const ackHtml = shell(
    "We got your message",
    `
    <p>Hi ${params.name.split(" ")[0] || "there"},</p>
    <p>Thanks for reaching out to the Freelance Visa team — we've received your message and will reply to this email address shortly.</p>
    <p style="white-space:pre-wrap;padding:14px;background:#f7f2e7;border-radius:10px;">${params.message}</p>
  `
  );

  logIfFailed(
    "contact form → platform",
    await resend.emails.send({
      from,
      to: platformEmail,
      replyTo: params.email,
      subject: `Contact form — ${params.name}`,
      html: platformHtml,
    })
  );

  logIfFailed(
    "contact form → sender ack",
    await resend.emails.send({
      from,
      to: params.email,
      subject: "We got your message — Freelance Visa",
      html: ackHtml,
    })
  );
}