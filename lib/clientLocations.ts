// Ku janë klientët — burim i vetëm për globin dhe seksionin e lokacioneve.
// `country` = emri në world-atlas (Natural Earth), që globi të ngjyrosë shtetin e duhur.

export type ClientCity = { sq: string; en: string; lat: number; lon: number; country: string };

// Renditja = përparësia e etiketës kur qytetet janë afër (pikat dalin gjithmonë)
export const CLIENT_CITIES: ClientCity[] = [
  { sq: "Nju Jork", en: "New York", lat: 40.71, lon: -74.01, country: "United States of America" },
  { sq: "Londër", en: "London", lat: 51.51, lon: -0.13, country: "United Kingdom" },
  { sq: "Stokholm", en: "Stockholm", lat: 59.33, lon: 18.07, country: "Sweden" },
  { sq: "Milano", en: "Milan", lat: 45.46, lon: 9.19, country: "Italy" },
  { sq: "Prishtinë", en: "Pristina", lat: 42.66, lon: 21.16, country: "Kosovo" },
  { sq: "Nyrëmberg", en: "Nuremberg", lat: 49.45, lon: 11.08, country: "Germany" },
  { sq: "Këln", en: "Cologne", lat: 50.94, lon: 6.96, country: "Germany" },
  { sq: "Straubing", en: "Straubing", lat: 48.88, lon: 12.57, country: "Germany" },
];

export const CLIENT_HQ: ClientCity = { sq: "Tiranë", en: "Tirana", lat: 41.33, lon: 19.82, country: "Albania" };

export type ClientCountry = { country: string; sq: string; en: string; flag: string; lat: number; lon: number };

// Lista e shteteve për seksionin "Ku janë klientët tanë" (lat/lon = ku kthehet globi)
export const CLIENT_COUNTRIES: ClientCountry[] = [
  { country: "Albania", sq: "Shqipëri", en: "Albania", flag: "al", lat: 41.33, lon: 19.82 },
  { country: "Kosovo", sq: "Kosovë", en: "Kosovo", flag: "xk", lat: 42.66, lon: 21.16 },
  { country: "Germany", sq: "Gjermani", en: "Germany", flag: "de", lat: 50.2, lon: 10.4 },
  { country: "Italy", sq: "Itali", en: "Italy", flag: "it", lat: 45.46, lon: 9.19 },
  { country: "United Kingdom", sq: "Mbretëria e Bashkuar", en: "United Kingdom", flag: "gb", lat: 51.51, lon: -0.13 },
  { country: "Sweden", sq: "Suedi", en: "Sweden", flag: "se", lat: 59.33, lon: 18.07 },
  { country: "United States of America", sq: "SHBA", en: "United States", flag: "us", lat: 40.71, lon: -74.01 },
];

export const CLIENT_COUNTRY_NAMES = new Set(CLIENT_COUNTRIES.map((c) => c.country));

export const citiesOf = (country: string) =>
  [CLIENT_HQ, ...CLIENT_CITIES].filter((c) => c.country === country);
