// Data shqip pa u varur nga të dhënat ICU "sq-AL" (Chrome s'i ka: muajt dilnin në
// anglisht dhe datat në rendin muaj/ditë). E përbashkët për panelin, faqet që
// sheh klienti (oferta, portali) dhe email-et që dërgon serveri.

// Uses "en-GB" (always fully supported) to extract numeric date parts, then
// assembles the display string ourselves so server and client always agree
// byte-for-byte — avoids hydration mismatches from locale data gaps in Node.
export function dateParts(iso: string, opts: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Tirane", ...opts }).formatToParts(new Date(iso));
  return (type: string) => parts.find((p) => p.type === type)?.value ?? "";
}

const SQ_MONTHS = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];
const SQ_MONTHS_SHORT = ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj"];
const SQ_WEEKDAYS = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"];

type SqDateFormat = "date" | "long" | "datetime" | "day-time" | "month-year" | "month-short" | "weekday-date";

// Datë shqip për çdo shfletues. Pranon:
//  - timestamp ISO ("2026-11-01T09:30:00Z") → ora sipas Europe/Tirane
//  - datë e thjeshtë ("2026-11-01") → ajo ditë, pa zhvendosje nga zona kohore
//  - Date lokal (p.sh. new Date(y, m, 1) për grafikët) → sipas orës lokale
export function formatSq(value: string | Date, format: SqDateFormat = "date"): string {
  let p: { y: number; mo: number; d: number; h: number; mi: number; wd: number };
  if (value instanceof Date) {
    p = { y: value.getFullYear(), mo: value.getMonth(), d: value.getDate(), h: value.getHours(), mi: value.getMinutes(), wd: value.getDay() };
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, mo, d] = value.split("-").map(Number);
    p = { y, mo: mo - 1, d, h: 0, mi: 0, wd: new Date(Date.UTC(y, mo - 1, d)).getUTCDay() };
  } else {
    const get = dateParts(value, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      weekday: "short",
    });
    p = {
      y: Number(get("year")),
      mo: Number(get("month")) - 1,
      d: Number(get("day")),
      h: Number(get("hour")),
      mi: Number(get("minute")),
      wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    };
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${pad(p.d)}.${pad(p.mo + 1)}.${p.y}`;
  const time = `${pad(p.h)}:${pad(p.mi)}`;
  switch (format) {
    case "long":
      return `${p.d} ${SQ_MONTHS[p.mo]} ${p.y}`;
    case "datetime":
      return `${date}, ${time}`;
    case "day-time":
      return `${pad(p.d)}.${pad(p.mo + 1)}, ${time}`;
    case "month-year":
      return `${SQ_MONTHS[p.mo]} ${p.y}`;
    case "month-short":
      return SQ_MONTHS_SHORT[p.mo];
    case "weekday-date":
      return `${SQ_WEEKDAYS[p.wd]}, ${p.d} ${SQ_MONTHS[p.mo]} ${p.y}`;
    default:
      return date;
  }
}

// "YYYY-MM-DD" sipas orës lokale. Mos përdor toISOString().slice(0, 10): ai jep datën
// UTC — në Shqipëri (UTC+1/+2) mesnata lokale bëhet dita e mëparshme, dhe "sot"
// ndryshon vetëm në 01:00/02:00.
export function localIsoDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Numra me ndarës mijëshesh shqip (1.234) — pa u varur nga ICU "sq-AL"
export function formatNumberSq(n: number): string {
  return n.toLocaleString("de-DE");
}

// "YYYY-MM-DD" sipas orës së Tiranës — për kodin në server (Vercel punon në UTC,
// kështu që localIsoDate atje do jepte ditën UTC).
export function tiranaIsoDate(d: Date = new Date()): string {
  const get = dateParts(d.toISOString(), { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${get("year")}-${get("month")}-${get("day")}`;
}
