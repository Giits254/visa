import { NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/resend";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json({ error: "Fill in your name, a valid email, and a message." }, { status: 400 });
  }

  try {
    await sendContactEmails({ name, email, message });
  } catch (err) {
    const messageText = err instanceof Error ? err.message : "Could not send your message.";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
