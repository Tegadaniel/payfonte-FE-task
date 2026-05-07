import { filterCountries } from "@/hooks/useCountries";
import type { Country } from "@/types/country";

const COUNTRIES: Country[] = [
  { name: "Nigeria", code: "+234", currency: "Nigerian Naira", currencyCode: "NGN", currencyIcon: "₦", locale: "NG" },
  { name: "Angola", code: "+244", currency: "Angolan Kwanza", currencyCode: "AOA", currencyIcon: "Kz", locale: "AO" },
  { name: "Ghana", code: "+233", currency: "Ghanaian Cedi", currencyCode: "GHS", currencyIcon: "₵", locale: "GH" },
  { name: "France", code: "+33", currency: "Euro", currencyCode: "EUR", currencyIcon: "€", locale: "FR" },
];

test("returns all countries when query is empty", () => {
  expect(filterCountries(COUNTRIES, "", "name")).toHaveLength(4);
  expect(filterCountries(COUNTRIES, "   ", "name")).toHaveLength(4);
});

test("filters by name (case-insensitive)", () => {
  const result = filterCountries(COUNTRIES, "nig", "name");
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe("Nigeria");
});

test("filters by country code", () => {
  const result = filterCountries(COUNTRIES, "+23", "code");
  expect(result).toHaveLength(2); // +234 (Nigeria), +233 (Ghana)
  expect(result.map((c) => c.name)).toEqual(["Nigeria", "Ghana"]);
});

test("filters by currency name", () => {
  const result = filterCountries(COUNTRIES, "kwanza", "currency");
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe("Angola");
});

test("filters by currency code", () => {
  const result = filterCountries(COUNTRIES, "ng", "currencyCode");
  expect(result).toHaveLength(1);
  expect(result[0].currencyCode).toBe("NGN");
});

test("returns empty array when nothing matches", () => {
  expect(filterCountries(COUNTRIES, "zzz", "name")).toHaveLength(0);
});

test("filter is case-insensitive", () => {
  expect(filterCountries(COUNTRIES, "GHANA", "name")).toHaveLength(1);
  expect(filterCountries(COUNTRIES, "eur", "currencyCode")).toHaveLength(1);
});
