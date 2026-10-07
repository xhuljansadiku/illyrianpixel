/**
 * Contact form schema — shared by the form (client) and /api/contact (server)
 * so that validation rules can never drift apart.
 */

export const SERVICE_OPTIONS = [
  "website",
  "ecommerce",
  "seo",
  "google-ads",
  "branding",
  "digital-marketing",
  "maintenance",
  "other",
] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const BUDGET_OPTIONS = ["under-1k", "1k-3k", "3k-5k", "5k-10k", "10k-plus", "unsure"] as const;
export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const CONTACT_FIELDS = ["name", "company", "email", "phone", "service", "budget", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export type ContactErrorCode = "required" | "invalid" | "too_short" | "too_long";
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;
export type ContactValues = Record<ContactField, string>;

export const REQUIRED_FIELDS: readonly ContactField[] = ["name", "email", "service", "budget", "message"];

export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { max: 120 },
  email: { max: 254 },
  phone: { minDigits: 6, maxDigits: 15, max: 30 },
  message: { min: 20, max: 5000 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()\-.]+$/;

export const EMPTY_CONTACT_VALUES: ContactValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  message: "",
};

/** Turns untrusted input (JSON body or form data) into trimmed strings. */
export function normalizeContactInput(raw: Record<string, unknown>): ContactValues {
  const values = { ...EMPTY_CONTACT_VALUES };
  for (const field of CONTACT_FIELDS) {
    const value = raw[field];
    // Collapse whitespace in single-line fields; keep line breaks in the message.
    values[field] =
      typeof value === "string"
        ? field === "message"
          ? value.replace(/\r\n?/g, "\n").trim()
          : value.replace(/\s+/g, " ").trim()
        : "";
  }
  return values;
}

export function validateField(field: ContactField, rawValue: string): ContactErrorCode | null {
  const value = rawValue.trim();

  if (!value) return REQUIRED_FIELDS.includes(field) ? "required" : null;

  switch (field) {
    case "name":
      if (value.length < LIMITS.name.min) return "too_short";
      if (value.length > LIMITS.name.max) return "too_long";
      return null;
    case "company":
      return value.length > LIMITS.company.max ? "too_long" : null;
    case "email":
      if (value.length > LIMITS.email.max) return "too_long";
      return EMAIL_PATTERN.test(value) ? null : "invalid";
    case "phone": {
      if (value.length > LIMITS.phone.max) return "too_long";
      const digits = value.replace(/\D/g, "").length;
      const valid =
        PHONE_PATTERN.test(value) && digits >= LIMITS.phone.minDigits && digits <= LIMITS.phone.maxDigits;
      return valid ? null : "invalid";
    }
    case "service":
      return (SERVICE_OPTIONS as readonly string[]).includes(value) ? null : "invalid";
    case "budget":
      return (BUDGET_OPTIONS as readonly string[]).includes(value) ? null : "invalid";
    case "message":
      if (value.length < LIMITS.message.min) return "too_short";
      if (value.length > LIMITS.message.max) return "too_long";
      return null;
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
