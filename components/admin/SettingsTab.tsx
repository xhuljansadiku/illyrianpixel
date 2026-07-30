"use client";

import { useEffect, useState } from "react";
import { CARD, EmptyState, formatDate } from "@/components/admin/ui";
import {
  EMAIL_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_LABELS,
  EMAIL_TEMPLATE_PLACEHOLDERS,
  type EmailTemplate,
  type EmailTemplateKey,
} from "@/lib/emailTemplateTypes";
import type { AdminLogin, SiteSettings } from "@/components/AdminDashboard";

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadLoginHistoryCSV(rows: AdminLogin[]) {
  const header = "statusi,ip,user_agent,data\n";
  const body = rows
    .map((l) =>
      [l.success ? "sukses" : "dështim", l.ip ?? "", l.user_agent ?? "", l.created_at]
        .map((v) => csvCell(String(v ?? "")))
        .join(",")
    )
    .join("\n");
  const blob = new Blob(["﻿" + header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hyrjet-admin-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── 2FA card ─────────────────────────────────────────────────────────────────
function TwoFactorCard() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<{ secret: string; uri: string; qr: string } | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regenToken, setRegenToken] = useState("");

  useEffect(() => {
    fetch("/api/admin/2fa")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      // QR gjenerohet lokalisht — sekreti nuk del te asnjë shërbim i jashtëm
      const QRCode = (await import("qrcode")).default;
      const qr = await QRCode.toDataURL(data.uri, { margin: 1, width: 192 });
      setSetup({ secret: data.secret, uri: data.uri, qr });
      setToken("");
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  const confirmEnable = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", token }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      setEnabled(true);
      setSetup(null);
      setToken("");
      if (Array.isArray(data.recoveryCodes)) setRecoveryCodes(data.recoveryCodes);
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  const downloadRecoveryCodes = (codes: string[]) => {
    const text = `Kodet e rezervës — Illyrian Pixel Admin\nKëto kode mund të përdoren një herë secili në vend të kodit 2FA.\nRuaji në një vend të sigurt.\n\n${codes.join("\n")}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "illyrianpixel-2fa-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmRegenerate = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate_codes", token: regenToken }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      setRecoveryCodes(data.recoveryCodes);
      setRegenerating(false);
      setRegenToken("");
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDisable = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", token }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Gabim.");
        return;
      }
      setEnabled(false);
      setDisabling(false);
      setToken("");
      setRecoveryCodes(null);
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={CARD + " p-5"}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Verifikim me dy hapa (2FA)
        </p>
        {enabled !== null && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
              enabled
                ? "border-emerald-400/30 bg-emerald-400/8 text-emerald-300"
                : "border-[rgb(var(--a-text-rgb)/0.2)] text-[rgb(var(--a-text-rgb)/0.45)]"
            }`}
          >
            {enabled ? "✓ Aktiv" : "Joaktiv"}
          </span>
        )}
      </div>

      {enabled === null && <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">Duke kontrolluar…</p>}

      {enabled === false && !setup && (
        <>
          <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.5)]">
            Shto një shtresë të dytë sigurie: pas fjalëkalimit do të kërkohet një kod 6-shifror nga
            aplikacioni autentifikues (Google Authenticator, 1Password, Authy etj.).
          </p>
          <button
            onClick={startSetup}
            disabled={busy}
            className="font-ui mt-4 rounded-[10px] border border-accent/40 px-4 py-2 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            {busy ? "Duke përgatitur…" : "Aktivizo 2FA"}
          </button>
        </>
      )}

      {setup && (
        <div className="flex flex-wrap items-start gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qr} alt="Kodi QR për 2FA" className="h-44 w-44 rounded-lg bg-white p-2" />
          <div className="min-w-[240px] flex-1">
            <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.6)]">
              1. Skano kodin QR me aplikacionin autentifikues.<br />
              2. Ose shtoje manualisht me këtë sekret:
            </p>
            <code className="mt-2 block break-all rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 font-mono text-[11px] text-accent">
              {setup.secret}
            </code>
            <p className="mt-3 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">3. Shkruaj kodin 6-shifror për ta konfirmuar:</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="font-mono w-32 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-center text-[16px] tracking-[0.3em] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <button
                onClick={confirmEnable}
                disabled={busy || token.length !== 6}
                className="font-ui rounded-[10px] bg-accent px-4 py-2 text-[12px] font-bold text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
              >
                {busy ? "…" : "Konfirmo"}
              </button>
              <button
                onClick={() => setSetup(null)}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Anulo
              </button>
            </div>
          </div>
        </div>
      )}

      {enabled === true && (
        <>
          <p className="text-[12px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.5)]">
            Hyrja kërkon fjalëkalimin + kodin 6-shifror nga aplikacioni autentifikues.
          </p>

          {recoveryCodes && (
            <div className="mt-4 rounded-[10px] border border-accent/30 bg-accent/5 p-4">
              <p className="text-[12px] font-semibold text-[var(--a-text)]">
                Kodet e rezervës — ruaji tani, nuk do të shfaqen përsëri:
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[12px] tracking-[0.05em] text-accent sm:grid-cols-3">
                {recoveryCodes.map((c) => (
                  <code key={c} className="rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-2 py-1 text-center">
                    {c}
                  </code>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => downloadRecoveryCodes(recoveryCodes)}
                  className="font-ui rounded-[10px] border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10"
                >
                  Shkarko kodet
                </button>
                <button
                  onClick={() => setRecoveryCodes(null)}
                  className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
                >
                  Mbylle
                </button>
              </div>
            </div>
          )}

          {!disabling && !regenerating && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setRegenerating(true);
                  setRegenToken("");
                  setError("");
                }}
                className="font-ui rounded-[10px] border border-[var(--a-border)] px-4 py-2 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
              >
                Rigjenero kodet e rezervës
              </button>
              <button
                onClick={() => {
                  setDisabling(true);
                  setToken("");
                  setError("");
                }}
                className="font-ui rounded-[10px] border border-red-400/30 px-4 py-2 text-[12px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10"
              >
                Çaktivizo 2FA
              </button>
            </div>
          )}

          {regenerating && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="w-full text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
                Kjo do të zhvlerësojë kodet e vjetra. Shkruaj kodin 6-shifror aktual për të konfirmuar:
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={regenToken}
                onChange={(e) => setRegenToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="font-mono w-32 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-center text-[14px] tracking-[0.25em] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <button
                onClick={confirmRegenerate}
                disabled={busy || regenToken.length !== 6}
                className="font-ui rounded-[10px] bg-accent px-4 py-2 text-[12px] font-bold text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
              >
                {busy ? "…" : "Konfirmo"}
              </button>
              <button
                onClick={() => setRegenerating(false)}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Anulo
              </button>
            </div>
          )}

          {disabling && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="Kodi aktual"
                className="font-mono w-36 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-center text-[14px] tracking-[0.25em] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <button
                onClick={confirmDisable}
                disabled={busy || token.length !== 6}
                className="font-ui rounded-[10px] border border-red-400/40 px-4 py-2 text-[12px] font-semibold text-red-400 transition-colors hover:bg-red-400/10 disabled:opacity-40"
              >
                {busy ? "…" : "Konfirmo çaktivizimin"}
              </button>
              <button
                onClick={() => setDisabling(false)}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Anulo
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="mt-3 text-[12px] text-red-400/80">{error}</p>}
    </div>
  );
}

// ── Settings tab ──────────────────────────────────────────────────────────────
export default function SettingsTab({ adminLogins, initialSettings }: { adminLogins: AdminLogin[]; initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [logins, setLogins] = useState(adminLogins);
  const [loginsSince, setLoginsSince] = useState("");
  const [loginsUntil, setLoginsUntil] = useState("");
  const [loginsLoading, setLoginsLoading] = useState(false);

  const filterLogins = async () => {
    setLoginsLoading(true);
    try {
      const params = new URLSearchParams();
      if (loginsSince) params.set("since", loginsSince);
      if (loginsUntil) params.set("until", `${loginsUntil}T23:59:59.999Z`);
      params.set("limit", loginsSince || loginsUntil ? "1000" : "20");
      const res = await fetch(`/api/admin/login-history?${params.toString()}`);
      const data = await res.json();
      if (data.success) setLogins(data.logins);
    } catch {
      // injoro
    } finally {
      setLoginsLoading(false);
    }
  };

  const resetLoginsFilter = () => {
    setLoginsSince("");
    setLoginsUntil("");
    setLogins(adminLogins);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      } else {
        setError(data.error ?? "Gabim i panjohur.");
      }
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={CARD + " p-5"}>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Cilësime të faqes
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Kodi i zbritjes (newsletter)
            </label>
            <input
              type="text"
              value={settings.newsletter_discount_code}
              onChange={(e) => setSettings((s) => ({ ...s, newsletter_discount_code: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Numri WhatsApp (pa +, p.sh. 355...)
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings((s) => ({ ...s, whatsapp_number: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            {saving ? "Duke ruajtur…" : "Ruaj"}
          </button>
          {saved && <span className="text-[11px] text-emerald-400/80">U ruajt.</span>}
          {error && <span className="text-[11px] text-red-400/80">{error}</span>}
        </div>
        <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Këto vlera përdoren në email-et e newsletter-it (kodi i zbritjes dhe lidhja WhatsApp).
        </p>
      </div>

      <div className={CARD + " p-5"}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Popup &quot;Para se të largoheni&quot; (exit-intent)
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
            <input
              type="checkbox"
              checked={settings.popup_enabled === "1"}
              onChange={(e) => setSettings((s) => ({ ...s, popup_enabled: e.target.checked ? "1" : "0" }))}
              className="h-3.5 w-3.5 accent-[#ab8339]"
            />
            Aktiv
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Mbititulli
            </label>
            <input
              type="text"
              value={settings.popup_eyebrow}
              onChange={(e) => setSettings((s) => ({ ...s, popup_eyebrow: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Titulli
            </label>
            <input
              type="text"
              value={settings.popup_title}
              onChange={(e) => setSettings((s) => ({ ...s, popup_title: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Teksti
            </label>
            <input
              type="text"
              value={settings.popup_text}
              onChange={(e) => setSettings((s) => ({ ...s, popup_text: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Butoni (CTA)
            </label>
            <input
              type="text"
              value={settings.popup_cta}
              onChange={(e) => setSettings((s) => ({ ...s, popup_cta: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
        <p className="mb-3 mt-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">
          🇬🇧 Versioni anglisht (faqja /en)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Eyebrow (EN)
            </label>
            <input
              type="text"
              value={settings.popup_eyebrow_en}
              onChange={(e) => setSettings((s) => ({ ...s, popup_eyebrow_en: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Title (EN)
            </label>
            <input
              type="text"
              value={settings.popup_title_en}
              onChange={(e) => setSettings((s) => ({ ...s, popup_title_en: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              Text (EN)
            </label>
            <input
              type="text"
              value={settings.popup_text_en}
              onChange={(e) => setSettings((s) => ({ ...s, popup_text_en: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
              CTA (EN)
            </label>
            <input
              type="text"
              value={settings.popup_cta_en}
              onChange={(e) => setSettings((s) => ({ ...s, popup_cta_en: e.target.value }))}
              className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            {saving ? "Duke ruajtur…" : "Ruaj"}
          </button>
          {saved && <span className="text-[11px] text-emerald-400/80">U ruajt.</span>}
          {error && <span className="text-[11px] text-red-400/80">{error}</span>}
        </div>
        <p className="mt-3 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
          Popup-i shfaqet një herë për sesion kur vizitori bëhet gati të largohet nga faqja. Ndryshimet hyjnë në fuqi brenda ~5 minutash.
        </p>
      </div>

      <TwoFactorCard />

      <div className={CARD + " p-5"}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Hyrjet në admin {loginsSince || loginsUntil ? "" : "(20 të fundit)"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={loginsSince}
              onChange={(e) => setLoginsSince(e.target.value)}
              className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-2 py-1 text-[11px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            <span className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">—</span>
            <input
              type="date"
              value={loginsUntil}
              onChange={(e) => setLoginsUntil(e.target.value)}
              className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-2 py-1 text-[11px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
            />
            <button
              onClick={filterLogins}
              disabled={loginsLoading}
              className="font-ui rounded-[10px] border border-accent/40 px-3 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
            >
              {loginsLoading ? "…" : "Filtro"}
            </button>
            {(loginsSince || loginsUntil) && (
              <button
                onClick={resetLoginsFilter}
                className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
              >
                Pastro
              </button>
            )}
            <button
              onClick={() => downloadLoginHistoryCSV(logins)}
              disabled={logins.length === 0}
              className="font-ui rounded-[10px] border border-[var(--a-border)] px-3 py-1 text-[11px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)] disabled:opacity-50"
            >
              ⬇ CSV
            </button>
          </div>
        </div>
        {logins.length === 0 ? (
          <EmptyState text="Asnjë hyrje e regjistruar." />
        ) : (
          <ul className="max-h-[420px] space-y-1.5 overflow-y-auto">
            {logins.map((l) => (
              <li key={l.id} className="flex items-center justify-between text-[11px]">
                <span className={l.success ? "text-emerald-400/80" : "text-red-400/80"}>
                  {l.success ? "✓ Hyrje e suksesshme" : "✗ Tentativë e dështuar"}
                </span>
                <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{l.ip ?? "—"}</span>
                <span className="text-[rgb(var(--a-text-rgb)/0.35)]">{formatDate(l.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <EmailTemplatesEditor />

      <div className={CARD + " p-5"}>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
          Eksport / Backup
        </p>
        <p className="mb-4 text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
          Shkarko një kopje JSON me të gjitha të dhënat (kontakte, oferta/fatura, projekte, blog, FAQ, etj.) për arkivim ose backup.
        </p>
        <a
          href="/api/admin/export"
          download
          className="font-ui inline-flex items-center gap-2 rounded-[10px] border border-accent/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent/10"
        >
          ⬇ Shkarko backup (JSON)
        </a>
      </div>
    </div>
  );
}

function EmailTemplatesEditor() {
  const [templates, setTemplates] = useState<Record<EmailTemplateKey, EmailTemplate> | null>(null);
  const [drafts, setDrafts] = useState<Record<EmailTemplateKey, { subject: string; intro: string }>>(
    {} as Record<EmailTemplateKey, { subject: string; intro: string }>
  );
  const [savingKey, setSavingKey] = useState<EmailTemplateKey | null>(null);
  const [savedKey, setSavedKey] = useState<EmailTemplateKey | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/email-templates");
        const data = await res.json();
        if (data.success) {
          const map = {} as Record<EmailTemplateKey, EmailTemplate>;
          const draftMap = {} as Record<EmailTemplateKey, { subject: string; intro: string }>;
          for (const t of data.templates as EmailTemplate[]) {
            map[t.key] = t;
            draftMap[t.key] = { subject: t.subject, intro: t.intro };
          }
          setTemplates(map);
          setDrafts(draftMap);
        }
      } catch {
        // injoro
      }
    })();
  }, []);

  const save = async (key: EmailTemplateKey) => {
    setSavingKey(key);
    setSavedKey(null);
    try {
      const res = await fetch(`/api/admin/email-templates/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts[key]),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates((prev) => (prev ? { ...prev, [key]: data.template } : prev));
        setSavedKey(key);
      }
    } finally {
      setSavingKey(null);
    }
  };

  if (!templates) return null;

  return (
    <div className={CARD + " p-5"}>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--a-text-rgb)/0.4)]">
        Shabllonet e email-eve automatikë
      </p>
      <p className="mb-4 text-[12px] text-[rgb(var(--a-text-rgb)/0.5)]">
        Përshtat tekstin e email-eve që dërgohen automatikisht (kujtues, kujtesa pagese, përmbledhje). Përdor placeholders si{" "}
        <code className="text-accent">{"{{number}}"}</code> që zëvendësohen automatikisht.
      </p>
      <div className="space-y-5">
        {EMAIL_TEMPLATE_KEYS.map((key) => {
          const draft = drafts[key] ?? { subject: "", intro: "" };
          return (
            <div key={key} className="rounded-[10px] border border-[var(--a-border)] p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12px] font-semibold text-[var(--a-text)]">{EMAIL_TEMPLATE_LABELS[key]}</p>
                {EMAIL_TEMPLATE_PLACEHOLDERS[key].length > 0 && (
                  <p className="text-[10px] text-[rgb(var(--a-text-rgb)/0.35)]">
                    Placeholders: {EMAIL_TEMPLATE_PLACEHOLDERS[key].map((p) => (
                      <code key={p} className="ml-1 text-accent">{p}</code>
                    ))}
                  </p>
                )}
              </div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                Subjekti
              </label>
              <input
                type="text"
                value={draft.subject}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [key]: { ...draft, subject: e.target.value } }))
                }
                className="font-ui mb-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                Teksti
              </label>
              <textarea
                rows={3}
                value={draft.intro}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [key]: { ...draft, intro: e.target.value } }))
                }
                className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => save(key)}
                  disabled={savingKey === key}
                  className="font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                >
                  {savingKey === key ? "Duke ruajtur…" : "Ruaj"}
                </button>
                {savedKey === key && <span className="text-[11px] text-emerald-400/80">U ruajt ✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
