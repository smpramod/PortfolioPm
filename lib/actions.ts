"use server";

import { Resend } from "resend";
import { SITE } from "./site";
import type { ContactFormState } from "./types";

import { headers } from "next/headers";

import fs from "fs";
import path from "path";

function getEnvVar(key: string, defaultValue?: string): string | undefined {
  if (process.env[key]) return process.env[key];

  try {
    const cwd = process.cwd();
    const envFiles = [".env.local", ".env", ".env.example"];
    for (const file of envFiles) {
      const fullPath = path.join(cwd, file);
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, "utf-8");
        const match = text.match(new RegExp(`^\\s*${key}\\s*=\\s*([^\\r\\n]+)`, "m"));
        if (match && match[1]?.trim()) {
          const val = match[1].trim().replace(/^['"]|['"]$/g, "");
          return val;
        }
      }
    }
  } catch (err) {
    console.error(`[actions.ts] Failed to read fallback env for ${key}:`, err);
  }

  return defaultValue;
}

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;
const EMAIL_MAX_LENGTH = 254;

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

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

  const resendApiKey = getEnvVar("RESEND_API_KEY");
  const contactToEmail = getEnvVar("CONTACT_TO_EMAIL", "lbo.org.ask@gmail.com") ?? "lbo.org.ask@gmail.com";
  const publicContactEmail = SITE.emailWork; // Publicly shown email: margudrep@gmail.com
  const resendFromEmail = getEnvVar("RESEND_FROM_EMAIL", "onboarding@resend.dev") ?? "onboarding@resend.dev";

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
      error: `Email service is not configured yet. Please email me directly at ${publicContactEmail}.`,
    };
  }

  const resend = new Resend(resendApiKey);

  try {
    const { error } = await resend.emails.send({
      from: resendFromEmail,
      to: [contactToEmail],
      replyTo: email,
      subject: `New portfolio contact note from ${name}`,
      text: [
        `Portfolio contact form submission for Pramod Margudre`,
        `From: ${name} (${email})`,
        "",
        `Message:`,
        message,
      ].join("\n"),
      html: `
        <h2>New Portfolio Contact Note</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Recipient:</strong> Pramod Margudre (${escapeHtml(publicContactEmail)})</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        ok: false,
        error: `Could not send message automatically. Please email me directly at ${publicContactEmail}.`,
      };
    }

    return { ok: true, error: "" };
  } catch (err) {
    console.error("Resend error:", err);
    return {
      ok: false,
      error: `Could not send message automatically. Please email me directly at ${publicContactEmail}.`,
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
