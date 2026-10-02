"use client";

// Versioni klient i NextIntlClientProvider, për përdorim jashtë segmentit [locale]
// (p.sh. app/not-found.tsx). Importuar drejtpërdrejt në një Server Component,
// "next-intl" jep versionin server, i cili lexon formats/now/timeZone nga request
// config → headers() → ÇDO faqe e sajtit bëhet dinamike (not-found renderohet në
// pemën e secilës faqe). Ky wrapper e shmang krejtësisht atë rrugë.
export { NextIntlClientProvider as default } from "next-intl";
