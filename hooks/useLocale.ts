import { useState, useCallback } from "react";
import type { Country } from "@/types/country";

const STORAGE_KEY = "payfonte_home_country";

function loadStored(): Country | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Country) : null;
  } catch {
    return null;
  }
}

export function useLocale() {
  const [homeCountry, setHomeCountryState] = useState<Country | null>(loadStored);

  const setHomeCountry = useCallback((country: Country | null) => {
    setHomeCountryState(country);
    if (typeof window === "undefined") return;
    if (country) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(country));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Derive a BCP-47 locale tag: language from browser, region from selected country
  const localeTag = homeCountry?.locale
    ? `en-${homeCountry.locale}`
    : typeof navigator !== "undefined"
    ? navigator.language
    : "en-US";

  return { homeCountry, setHomeCountry, localeTag };
}
