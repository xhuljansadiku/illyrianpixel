"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FORM_COPY } from "@/content/form";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  BUDGET_OPTIONS,
  CONTACT_FIELDS,
  EMPTY_CONTACT_VALUES,
  LIMITS,
  REQUIRED_FIELDS,
  SERVICE_OPTIONS,
  hasErrors,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactValues,
  type ServiceOption,
} from "@/lib/contact/schema";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  locale: Locale;
  variant?: "page" | "modal";
  /** Where the form was opened from (included in the inquiry for context). */
  source?: string;
  defaultService?: ServiceOption;
};

/**
 * Project inquiry form.
 * - Validates on blur and on submit with the same rules as the API.
 * - Errors are linked to their fields (aria-invalid / aria-describedby) and the
 *   first invalid field receives focus.
 * - Spam protection: honeypot field + minimum fill time (checked on the server)
 *   + rate limiting in /api/contact.
 * - Without JavaScript the form still posts to /api/contact (native validation).
 */
export function ContactForm({ locale, variant = "page", source, defaultService }: ContactFormProps) {
  const copy = FORM_COPY[locale];
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);

  const [values, setValues] = useState<ContactValues>({ ...EMPTY_CONTACT_VALUES, service: defaultService ?? "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [trap, setTrap] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
    // Custom, accessible validation replaces the browser's bubbles once JS runs.
    formRef.current?.setAttribute("novalidate", "");
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const fieldId = (field: ContactField) => `${uid}-${field}`;
  const errorId = (field: ContactField) => `${uid}-${field}-error`;

  const setFieldError = (field: ContactField, value: string) => {
    const error = validateField(field, value);
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const handleChange = (field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Once a field has shown an error, re-validate while typing so it clears promptly.
    if (touched[field]) setFieldError(field, value);
  };

  const handleBlur = (field: ContactField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setFieldError(field, values[field]);
  };

  const focusFirstError = (fieldErrors: ContactErrors) => {
    const first = CONTACT_FIELDS.find((field) => fieldErrors[field]);
    if (first) document.getElementById(fieldId(first))?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(CONTACT_FIELDS.map((field) => [field, true])));

    if (hasErrors(nextErrors)) {
      setStatus("idle");
      setAnnouncement(copy.summary);
      focusFirstError(nextErrors);
      return;
    }

    setStatus("submitting");
    setFailure("");
    setAnnouncement(copy.submitting);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          website: trap,
          startedAt: startedAt.current,
          locale,
          source: [variant, source].filter(Boolean).join(":"),
          page: window.location.pathname,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setAnnouncement("");
        return;
      }

      const data = (await response.json().catch(() => null)) as { errors?: ContactErrors } | null;
      if (response.status === 400 && data?.errors && hasErrors(data.errors)) {
        setErrors(data.errors);
        setStatus("idle");
        setAnnouncement(copy.summary);
        focusFirstError(data.errors);
        return;
      }

      const message = response.status === 429 ? copy.failure.rateLimited : copy.failure.generic;
      setFailure(message);
      setStatus("error");
      setAnnouncement(message);
    } catch {
      setFailure(copy.failure.network);
      setStatus("error");
      setAnnouncement(copy.failure.network);
    }
  };

  const reset = () => {
    setValues({ ...EMPTY_CONTACT_VALUES, service: defaultService ?? "" });
    setErrors({});
    setTouched({});
    setFailure("");
    setStatus("idle");
    startedAt.current = Date.now();
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="form-success__icon" aria-hidden="true">
          <Icon name="check" size={26} />
        </span>
        <h3 ref={successRef} tabIndex={-1} className="form-success__title">
          {copy.success.title}
        </h3>
        <p className="form-success__text">{copy.success.text}</p>
        <Button variant="secondary" size="sm" onClick={reset}>
          {copy.success.again}
        </Button>
      </div>
    );
  }

  const visibleError = (field: ContactField) => (touched[field] ? errors[field] : undefined);

  const controlProps = (field: ContactField) => {
    const error = visibleError(field);
    return {
      id: fieldId(field),
      name: field,
      value: values[field],
      required: REQUIRED_FIELDS.includes(field),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? errorId(field) : undefined,
      onBlur: () => handleBlur(field),
      className: "field__control",
    };
  };

  const renderField = (field: ContactField, control: ReactNode) => {
    const error = visibleError(field);
    const required = REQUIRED_FIELDS.includes(field);
    return (
      <div className="field">
        <label className="field__label" htmlFor={fieldId(field)}>
          {copy.fields[field].label}
          {required ? (
            <span className="field__required" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="field__optional">({copy.optional})</span>
          )}
        </label>
        {control}
        {error && (
          <p className="field__error" id={errorId(field)}>
            <Icon name="alert" />
            <span>{copy.errors[field][error] ?? copy.summary}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      className={`form form--${variant}`}
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      aria-describedby={`${uid}-hint`}
    >
      <input type="hidden" name="locale" value={locale} />

      <p className="form__hint" id={`${uid}-hint`}>
        {copy.requiredHint}
      </p>

      {status === "error" && failure && (
        <div className="form-alert" role="alert">
          <Icon name="alert" />
          <div>
            <p className="form-alert__title">{copy.failure.title}</p>
            <p>{failure}</p>
          </div>
        </div>
      )}

      <div className="form__row form__row--2">
        {renderField(
          "name",
          <input
            {...controlProps("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max}
            placeholder={copy.fields.name.placeholder}
            onChange={(event) => handleChange("name", event.target.value)}
          />,
        )}
        {renderField(
          "company",
          <input
            {...controlProps("company")}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company.max}
            placeholder={copy.fields.company.placeholder}
            onChange={(event) => handleChange("company", event.target.value)}
          />,
        )}
      </div>

      <div className="form__row form__row--2">
        {renderField(
          "email",
          <input
            {...controlProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email.max}
            placeholder={copy.fields.email.placeholder}
            onChange={(event) => handleChange("email", event.target.value)}
          />,
        )}
        {renderField(
          "phone",
          <input
            {...controlProps("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phone.max}
            placeholder={copy.fields.phone.placeholder}
            onChange={(event) => handleChange("phone", event.target.value)}
          />,
        )}
      </div>

      <div className="form__row form__row--2">
        {renderField(
          "service",
          <select
            {...controlProps("service")}
            className={`field__control${values.service ? "" : " is-empty"}`}
            onChange={(event) => {
              handleChange("service", event.target.value);
              setFieldError("service", event.target.value);
            }}
          >
            <option value="" disabled>
              {copy.selectPlaceholder}
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {copy.services[option]}
              </option>
            ))}
          </select>,
        )}
        {renderField(
          "budget",
          <select
            {...controlProps("budget")}
            className={`field__control${values.budget ? "" : " is-empty"}`}
            onChange={(event) => {
              handleChange("budget", event.target.value);
              setFieldError("budget", event.target.value);
            }}
          >
            <option value="" disabled>
              {copy.selectPlaceholder}
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {copy.budgets[option]}
              </option>
            ))}
          </select>,
        )}
      </div>

      {renderField(
        "message",
        <textarea
          {...controlProps("message")}
          rows={variant === "modal" ? 5 : 6}
          maxLength={LIMITS.message.max}
          placeholder={copy.fields.message.placeholder}
          onChange={(event) => handleChange("message", event.target.value)}
        />,
      )}

      {/* Honeypot: invisible to people, tempting for bots. */}
      <div className="field--trap" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>{copy.honeypot}</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
        />
      </div>

      <div className="form__footer">
        <Button type="submit" variant="primary" size="lg" icon="arrow" block="mobile" loading={status === "submitting"}>
          {status === "submitting" ? copy.submitting : copy.submit}
        </Button>
        <p className="form__privacy">
          {copy.privacy.before}
          <Link href="/privacy">{copy.privacy.link}</Link>
          {copy.privacy.after}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </form>
  );
}
