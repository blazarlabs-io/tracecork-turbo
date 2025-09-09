"use client";

/**
 * LanguageProvider
 * ----------------
 * - Single source of truth on the CLIENT for the selected locale.
 * - Reads the current locale ONLY from the NEXT_LOCALE cookie on mount.
 * - Does NOT fetch on mount and does NOT overwrite cookies.
 * - When user changes the language, calls a server action (setUserLocale)
 *   to write the cookie, then router.refresh() so SSR re-renders in that locale.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

// Server action that writes the NEXT_LOCALE cookie.
// (Keep this as the ONLY place where the cookie is written.)
import { setUserLocale } from "../services/locale";

// Locale configuration (union type + list + default) from your i18n config.
import { locales, defaultLocale, type Locale } from "../i18n/config"; 

export interface LocaleProviderInterface {
  isPending: boolean;               // true while the cookie is being written/refreshed
  localeSelected: Locale;           // current selected locale on client
  onLocaleChange: (value: Locale) => void; // handler to change locale
}

const ctxInit: LocaleProviderInterface = {
  isPending: false,
  localeSelected: defaultLocale,
  onLocaleChange: () => {},
};

const LocaleContext = createContext<LocaleProviderInterface>(ctxInit);

export const useLocaleContext = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
};

/**
 * Normalize an arbitrary string to your union Locale.
 * Falls back to defaultLocale if the input is not one of the allowed codes.
 */
const asLocale = (val: string): Locale =>
  (locales as readonly string[]).includes(val) ? (val as Locale) : defaultLocale;

export const LocaleProvider = ({ children }: React.PropsWithChildren) => {
  const initRef = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [localeSelected, setLocaleSelected] = useState<Locale>(defaultLocale);
  const router = useRouter();

  /**
   * Read the cookie ONCE on mount.
   * Important: we do not write any cookie here and we do not fetch.
   * This avoids the “SSR shows FR, then hydrates to EN” flicker.
   */
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const readCookie = (name: string): string => {
      // Simple cookie reader; returns "" if not found.
      const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
      return match && match[1] ? decodeURIComponent(match[1]) : "";
    };

    setLocaleSelected(asLocale(readCookie("NEXT_LOCALE")));
  }, []);

  /**
   * User-initiated language change:
   * 1) Update local state immediately for snappy UX.
   * 2) Write the NEXT_LOCALE cookie on the server.
   * 3) Refresh RSC so SSR reads the new cookie and re-renders in that locale.
   */
  const onLocaleChange = (value: Locale) => {
    const next = asLocale(value as string);
    setLocaleSelected(next); // UX instant
    startTransition(async () => {
      await setUserLocale(next); // server action: the ONLY place where cookie is written
      router.refresh();          // re-hydrate with SSR in the new locale
    });
  };

  return (
    <LocaleContext.Provider value={{ isPending, localeSelected, onLocaleChange }}>
      {children}
    </LocaleContext.Provider>
  );
};
