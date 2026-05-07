import { useQuery } from "@tanstack/react-query";
import { Country, CountryFilters } from "@/types/country";
import { useMemo } from "react";

const COUNTRIES_URL = "https://api.payfonte.com/payfusion/public/v1/countries";

async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(COUNTRIES_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch countries (${res.status})`);
  }
  const json = await res.json();
  const rawCountries = Array.isArray(json)
    ? json
    : (json.data ?? json.countries ?? []);

  return rawCountries.map((country: any) => ({
    countryId: country.countryId,
    name: country.countryName ?? country.name ?? "Unknown",
    code: country.countryCode ?? country.code ?? "",
    currency: country.currency ?? country.currencyName ?? "",
    currencyCode: country.currencyCode ?? "",
    currencyIcon: country.currencyIcon ?? "",
    locale: country.internetCountryCode ?? country.locale ?? "",
    flag: country.flag ?? "",
    flagURL:
      typeof country.flagURL === "object" && country.flagURL !== null
        ? {
            png: country.flagURL.png,
            svg: country.flagURL.svg,
            alt: country.flagURL.alt,
          }
        : undefined,
    region: country.region,
  }));
}

export function filterCountries(
  data: Country[],
  searchQuery: string,
  filterBy: CountryFilters["filterBy"]
): Country[] {
  if (!searchQuery.trim()) return data;
  const q = searchQuery.toLowerCase();
  return data.filter((c) => {
    switch (filterBy) {
      case "code":
        return c.code?.toLowerCase().includes(q);
      case "currency":
        return c.currency?.toLowerCase().includes(q);
      case "currencyCode":
        return c.currencyCode?.toLowerCase().includes(q);
      case "name":
      default:
        return c.name?.toLowerCase().includes(q);
    }
  });
}

export function useCountries({ query: searchQuery, filterBy }: CountryFilters) {
  const countriesQuery = useQuery<Country[], Error>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(
    () => filterCountries(countriesQuery.data ?? [], searchQuery, filterBy),
    [countriesQuery.data, searchQuery, filterBy]
  );

  return { ...countriesQuery, filtered };
}
