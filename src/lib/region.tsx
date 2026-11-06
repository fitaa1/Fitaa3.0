/* Prices and WhatsApp for the visitor's country (automatic; the footer flags are only a fail-safe).
 * middleware.ts picks which built copy of the page a visitor gets, and that copy says on its
 * <html> tag which currency to show (data-cur) and which WhatsApp number to use (data-wa).
 * The build renders the home page once per copy (scripts/prerender.mjs), so React starts from
 * exactly what is already on screen. The currency switch changes the prices in place and
 * remembers the choice in the fitaa_cur cookie, which middleware.ts reads on the next visit. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import pricing from "@/config/pricing.json";
import flags from "@/config/flags.json";
import { siteConfig } from "@/config/site";

export type Currency = "GHS" | "GBP" | "USD";
export type PriceKey = "getFound" | "getChosen" | "stayBooked" | "founding" | "upkeep";
export type NoteKey = "foundingNote" | "upkeepNote";
type CurrencyPrices = Record<PriceKey, { amount: number; text: string }> &
  Record<NoteKey, string> & { label: string; name: string };

export const currencies = pricing.order as Currency[];
const table = pricing.currencies as unknown as Record<Currency, CurrencyPrices>;
export const defaultCurrency = pricing.default as Currency;

/** The Ghana WhatsApp number, international format, digits only, from the one phone number in site.ts. */
export const ghanaWhatsApp = siteConfig.contact.phone.replace(/\D/g, "").replace(/^0/, "233");

export const isCurrency = (v: unknown): v is Currency => currencies.includes(v as Currency);

/** "447700900123" → "+44 7700 900123"; other numbers as "+" and the digits. */
export function formatPhone(digits: string): string {
  if (digits === ghanaWhatsApp) return siteConfig.contact.phone;
  if (/^447\d{9}$/.test(digits)) return `+44 ${digits.slice(2, 6)} ${digits.slice(6)}`;
  if (/^44\d{10}$/.test(digits)) return `+44 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return `+${digits}`;
}

type Region = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** WhatsApp number for this visitor, digits only. */
  waNumber: string;
  price: (key: PriceKey) => string;
  note: (key: NoteKey) => string;
  waLink: (text: string) => string;
};

const RegionContext = createContext<Region | null>(null);

/** What the page says it is (set by the build in each copy). Server render passes values in. */
function fromDocument(): { currency: Currency; waNumber: string } {
  if (typeof document === "undefined") return { currency: defaultCurrency, waNumber: ghanaWhatsApp };
  const d = document.documentElement.dataset;
  return {
    currency: isCurrency(d.cur) ? d.cur : defaultCurrency,
    waNumber: /^\d{8,15}$/.test(d.wa || "") ? d.wa! : ghanaWhatsApp,
  };
}

function savedCurrency(): Currency | null {
  const v = (document.cookie.match(/(?:^|;\s*)fitaa_cur=([a-z]{3})/i) || [])[1]?.toUpperCase();
  return isCurrency(v) ? v : null;
}

export function RegionProvider({
  children,
  currency: initialCurrency,
  waNumber: initialWa,
}: {
  children: ReactNode;
  currency?: Currency;
  waNumber?: string;
}) {
  const [start] = useState(() =>
    initialCurrency ? { currency: initialCurrency, waNumber: initialWa || ghanaWhatsApp } : fromDocument(),
  );
  const [currency, setState] = useState<Currency>(start.currency);
  const waNumber = start.waNumber;

  /* On Vercel the copy already matches the saved choice. Hosts without middleware.ts (a local
     preview, an exported copy) still honour it, after React has taken over the page. */
  useEffect(() => {
    const saved = savedCurrency();
    if (saved && saved !== start.currency) {
      setState(saved);
      document.documentElement.dataset.cur = saved;
    }
  }, [start.currency]);

  const setCurrency = useCallback((c: Currency) => {
    setState(c);
    document.documentElement.dataset.cur = c;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `fitaa_cur=${c.toLowerCase()}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  }, []);

  const value: Region = {
    currency,
    setCurrency,
    waNumber,
    price: (key) => table[currency][key].text,
    note: (key) => table[currency][key],
    waLink: (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
  };
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): Region {
  const r = useContext(RegionContext);
  if (!r) throw new Error("useRegion must be used inside <RegionProvider>");
  return r;
}

/** The fail-safe for a wrong country guess: three small flags in the footer (Ghana GHS, UK GBP,
 *  US USD). Prices already arrive in the visitor's currency, so this stays quiet on purpose
 *  (Nigel, 6 Nov 2026). Flags are drawn in SVG (src/config/flags.json) because Windows shows
 *  flag emoji as letters. Each is a labelled button; the pressed one is the currency on screen. */
export function CurrencySwitch({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useRegion();
  return (
    <div role="group" aria-label="Show prices in" className={`currency-flags ${className}`}>
      {currencies.map((c) => (
        <button
          key={c}
          type="button"
          data-currency={c}
          aria-pressed={c === currency}
          aria-label={`${table[c].label}, ${table[c].name}`}
          title={`Prices in ${table[c].label}`}
          onClick={() => setCurrency(c)}
          dangerouslySetInnerHTML={{ __html: (flags as Record<string, string>)[c] }}
        />
      ))}
    </div>
  );
}
