"use server";

import { Resend } from "resend";
import { SITE } from "./site";
import type { ContactFormState } from "./types";

import { headers } from "next/headers";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL ?? SITE.emailWork;
const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;
const EMAIL_MAX_LENGTH = 254;

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
    return false;
  }
  record.count++;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const rawName = String(formData.get("name") ?? "").trim();
  const name = rawName.replace(/[\r\n]/g, " "); // Prevent header injection
  const email = String(formData.get("email") ?? "").trim();
  const rawMessage = String(formData.get("message") ?? "").trim();
  const message = rawMessage.replace(/[\0\u200B-\u200D\uFEFF]/g, ""); // Strip null bytes and zero-width chars
  const company = String(formData.get("company") ?? "").trim();

  if (company) {
    return { ok: false, error: "Submission rejected." };
  }

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in name, email, and message." };
  }

  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return {
      ok: false,
      error: `Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters.`,
    };
  }

  if (email.length > EMAIL_MAX_LENGTH) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (message.length < MESSAGE_MIN_LENGTH || message.length > MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      error: `Message must be between ${MESSAGE_MIN_LENGTH} and ${MESSAGE_MAX_LENGTH} characters.`,
    };
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!resendApiKey) {
    return {
      ok: false,
      error: "Service unavailable.",
    };
  }

  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: resendFromEmail,
      to: [contactToEmail],
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        ok: false,
        error: "Failed to send message. Please try again later.",
      };
    }

    return { ok: true, error: "" };
  } catch (err) {
    console.error("Resend catch error:", err);
    return {
      ok: false,
      error: "Something went wrong while sending your message.",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
