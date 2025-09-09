"use server";

/**
 * Server-side locale helpers.
 * Keep all cookie writes in here (single responsibility).
 */

import { cookies } from "next/headers";
import { locales, defaultLocale, type Locale } from "../i18n/config";

/** Type guard: is a string one of the allowed locale codes? */
const isValid = (val: string): val is Locale =>
  (locales as readonly string[]).includes(val);

/**
 * Read current locale from cookie on the SERVER.
 * Useful in SSR (e.g., layouts) to know which language to render.
 */
export async function getUserLocale(): Promise<Locale> {
  const v = cookies().get("NEXT_LOCALE")?.value;
  return v && isValid(v) ? v : defaultLocale;
}

/**
 * Write the NEXT_LOCALE cookie.
 * Call this ONLY when the user explicitly changes the language.
 */
export async function setUserLocale(next: Locale) {
  cookies().set("NEXT_LOCALE", next, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    // secure: true,          // enable in production (HTTPS)
    // sameSite: "lax",
  });
}
