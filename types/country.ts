export interface CountryFlagURL {
  png: string;
  svg: string;
  alt: string;
}

export interface Country {
  countryId?: string;
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  currencyIcon: string;
  internetCountryCode: string;
  locale: string;
  flag?: string;
  flagURL?: CountryFlagURL;
  region?: string;
}

export type FilterKey = "name" | "code" | "currency" | "currencyCode";

export interface CountryFilters {
  query: string;
  filterBy: FilterKey;
}
