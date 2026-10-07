import type { BudgetOption, ContactErrorCode, ContactField, ServiceOption } from "@/lib/contact/schema";
import type { Locale } from "./types";

/**
 * Contact form copy. Imported by the (lazy-loaded) client form, so it is kept
 * separate from the main dictionaries to keep the browser bundle small.
 */
export type FormCopy = {
  fields: Record<ContactField, { label: string; placeholder: string }>;
  optional: string;
  requiredHint: string;
  selectPlaceholder: string;
  services: Record<ServiceOption, string>;
  budgets: Record<BudgetOption, string>;
  submit: string;
  submitting: string;
  errors: Record<ContactField, Partial<Record<ContactErrorCode, string>>>;
  summary: string;
  privacy: { before: string; link: string; after: string };
  success: { title: string; text: string; again: string };
  failure: { title: string; generic: string; rateLimited: string; network: string };
  honeypot: string;
};

const NBSP = " ";

export const FORM_COPY: Record<Locale, FormCopy> = {
  sv: {
    fields: {
      name: { label: "Namn", placeholder: "För- och efternamn" },
      company: { label: "Företag", placeholder: "Företagets namn" },
      email: { label: "E-post", placeholder: "namn@foretag.se" },
      phone: { label: "Telefon", placeholder: "070-123 45 67" },
      service: { label: "Tjänst", placeholder: "" },
      budget: { label: "Budget", placeholder: "" },
      message: {
        label: "Meddelande",
        placeholder: "Berätta kort om ditt företag, dina mål och vad du behöver hjälp med.",
      },
    },
    optional: "valfritt",
    requiredHint: "Fält markerade med * är obligatoriska.",
    selectPlaceholder: "Välj …",
    services: {
      website: "Webbplats",
      ecommerce: "E-handel",
      seo: "SEO",
      "google-ads": "Google Ads",
      branding: "Branding",
      "digital-marketing": "Digital marknadsföring",
      maintenance: "Underhåll",
      other: "Annat",
    },
    budgets: {
      "under-1k": `Under 1${NBSP}000${NBSP}€`,
      "1k-3k": `1${NBSP}000–3${NBSP}000${NBSP}€`,
      "3k-5k": `3${NBSP}000–5${NBSP}000${NBSP}€`,
      "5k-10k": `5${NBSP}000–10${NBSP}000${NBSP}€`,
      "10k-plus": `10${NBSP}000${NBSP}€ eller mer`,
      unsure: "Vet inte ännu",
    },
    submit: "Skicka projektförfrågan",
    submitting: "Skickar …",
    errors: {
      name: {
        required: "Fyll i ditt namn.",
        too_short: "Fyll i ditt namn.",
        too_long: "Namnet är för långt.",
      },
      company: { too_long: "Företagsnamnet är för långt." },
      email: {
        required: "Fyll i din e-postadress.",
        invalid: "Ange en giltig e-postadress, till exempel namn@foretag.se.",
        too_long: "E-postadressen är för lång.",
      },
      phone: {
        invalid: "Ange ett giltigt telefonnummer.",
        too_long: "Telefonnumret är för långt.",
      },
      service: { required: "Välj vilken tjänst det gäller.", invalid: "Välj vilken tjänst det gäller." },
      budget: { required: "Välj en ungefärlig budget.", invalid: "Välj en ungefärlig budget." },
      message: {
        required: "Berätta kort om ditt projekt.",
        too_short: "Berätta lite mer – minst 20 tecken.",
        too_long: `Meddelandet är för långt (max 5${NBSP}000 tecken).`,
      },
    },
    summary: "Kontrollera de markerade fälten.",
    privacy: {
      before: "Vi behandlar dina uppgifter enligt vår ",
      link: "integritetspolicy",
      after: ".",
    },
    success: {
      title: "Tack! Vi har tagit emot din förfrågan.",
      text: "Vi återkommer normalt inom en arbetsdag med tankar och nästa steg.",
      again: "Skicka en ny förfrågan",
    },
    failure: {
      title: "Meddelandet kunde inte skickas",
      generic: "Något gick fel. Försök igen om en stund.",
      rateLimited: "Du har skickat flera förfrågningar på kort tid. Vänta en stund och försök igen.",
      network: "Det gick inte att nå servern. Kontrollera din anslutning och försök igen.",
    },
    honeypot: "Lämna det här fältet tomt",
  },
  en: {
    fields: {
      name: { label: "Name", placeholder: "First and last name" },
      company: { label: "Company", placeholder: "Company name" },
      email: { label: "Email", placeholder: "name@company.com" },
      phone: { label: "Phone", placeholder: "+46 70 123 45 67" },
      service: { label: "Service", placeholder: "" },
      budget: { label: "Budget", placeholder: "" },
      message: {
        label: "Message",
        placeholder: "Tell us briefly about your business, your goals and what you need help with.",
      },
    },
    optional: "optional",
    requiredHint: "Fields marked with * are required.",
    selectPlaceholder: "Select …",
    services: {
      website: "Website",
      ecommerce: "E-Commerce",
      seo: "SEO",
      "google-ads": "Google Ads",
      branding: "Branding",
      "digital-marketing": "Digital Marketing",
      maintenance: "Maintenance",
      other: "Other",
    },
    budgets: {
      "under-1k": "Under €1,000",
      "1k-3k": "€1,000–€3,000",
      "3k-5k": "€3,000–€5,000",
      "5k-10k": "€5,000–€10,000",
      "10k-plus": "€10,000+",
      unsure: "Not sure yet",
    },
    submit: "Send project inquiry",
    submitting: "Sending …",
    errors: {
      name: {
        required: "Please enter your name.",
        too_short: "Please enter your name.",
        too_long: "The name is too long.",
      },
      company: { too_long: "The company name is too long." },
      email: {
        required: "Please enter your email address.",
        invalid: "Please enter a valid email address, such as name@company.com.",
        too_long: "The email address is too long.",
      },
      phone: {
        invalid: "Please enter a valid phone number.",
        too_long: "The phone number is too long.",
      },
      service: { required: "Please choose a service.", invalid: "Please choose a service." },
      budget: { required: "Please choose an approximate budget.", invalid: "Please choose an approximate budget." },
      message: {
        required: "Please tell us briefly about your project.",
        too_short: "Please tell us a bit more — at least 20 characters.",
        too_long: "The message is too long (max 5,000 characters).",
      },
    },
    summary: "Please check the highlighted fields.",
    privacy: {
      before: "We handle your details in accordance with our ",
      link: "privacy policy",
      after: ".",
    },
    success: {
      title: "Thank you! We've received your inquiry.",
      text: "We'll usually get back to you within one business day with thoughts and next steps.",
      again: "Send another inquiry",
    },
    failure: {
      title: "Your message could not be sent",
      generic: "Something went wrong. Please try again in a moment.",
      rateLimited: "You've sent several inquiries in a short time. Please wait a moment and try again.",
      network: "We couldn't reach the server. Check your connection and try again.",
    },
    honeypot: "Leave this field empty",
  },
};
