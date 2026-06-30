"use client";

import { useEffect, useState } from "react";
import { CARD, INPUT, BTN_GOLD, BTN_PLAIN, BTN_DANGER, useToasts, useConfirm } from "@/components/admin/ui";

export default function ClientsTab() {
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [pinForm, setPinForm] = useState({ pin: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const { pushToast, renderToasts } = useToasts();
  const [confirm, renderConfirm] = useConfirm();

  useEffect(() => {
    fetch("/api/admin/clients-pin")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHasPin(d.hasPin); });
  }, []);

  const handleSetPin = async () => {
    if (pinForm.pin.length < 4) return pushToast("PIN-i duhet të jetë të paktën 4 shifra.", "error");
    if (pinForm.pin !== pinForm.confirm) return pushToast("PIN-at nuk përputhen.", "error");
    setSaving(true);
    const res = await fetch("/api/admin/clients-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinForm.pin }),
    }).then((r) => r.json());
    setSaving(false);
    if (res.success) { setHasPin(true); setPinForm({ pin: "", confirm: "" }); pushToast("PIN-i u vendos me sukses.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  const handleRemovePin = async () => {
    const ok = await confirm({ title: "Hiq PIN-in", message: "Zona e klientëve do të bëhet e aksesueshme pa PIN.", danger: true, confirmText: "Hiq PIN" });
    if (!ok) return;
    const res = await fetch("/api/admin/clients-pin", { method: "DELETE" }).then((r) => r.json());
    if (res.success) { setHasPin(false); pushToast("PIN-i u hoq.", "success"); }
    else pushToast(res.error ?? "Gabim.", "error");
  };

  return (
    <div className="space-y-6">
      {renderToasts()}
      {renderConfirm()}

      {/* PIN management */}
      <div className={CARD + " p-5 space-y-4"}>
        <div>
          <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">PIN zona e klientëve</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.55)]">
            Klientët fusin këtë PIN për të parë projektet, pagesat dhe dokumentet e tyre.
          </p>
        </div>

        {hasPin === null ? (
          <p className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">Duke ngarkuar…</p>
        ) : hasPin ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-emerald-400">● PIN aktiv</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setHasPin(false); setTimeout(() => setHasPin(null), 0); setPinForm({ pin: "", confirm: "" }); }} className={BTN_PLAIN}>
                Ndrysho PIN
              </button>
              <button onClick={handleRemovePin} className={BTN_DANGER}>Hiq PIN</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-xs">
            <div>
              <label className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)] mb-1 block">PIN i ri (4–12 shifra)</label>
              <input
                type="password"
                inputMode="numeric"
                value={pinForm.pin}
                onChange={(e) => setPinForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 12) }))}
                placeholder="••••"
                className={INPUT + " w-full"}
              />
            </div>
            <div>
              <label className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.5)] mb-1 block">Konfirmo PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={pinForm.confirm}
                onChange={(e) => setPinForm((f) => ({ ...f, confirm: e.target.value.replace(/\D/g, "").slice(0, 12) }))}
                placeholder="••••"
                className={INPUT + " w-full"}
              />
            </div>
            <button
              onClick={handleSetPin}
              disabled={saving || pinForm.pin.length < 4 || pinForm.pin !== pinForm.confirm}
              className={BTN_GOLD}
            >
              {saving ? "Duke ruajtur…" : "Vendos PIN"}
            </button>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className={CARD + " p-5"}>
        <p className="font-ui text-[13px] font-semibold text-[var(--a-text)] mb-2">Si funksionon zona e klientëve</p>
        <ul className="space-y-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)]">
          <li>• Klientët aksesojnë <span className="text-[var(--a-text)]">/klientet</span> dhe fusin PIN-in për t'u identifikuar</li>
          <li>• Shohin projektet, faturat dhe statusin e pagesave të tyre</li>
          <li>• Nuk kanë akses në panelin admin</li>
          <li>• PIN-i ruhet i enkriptuar (SHA-256) në bazën e të dhënave</li>
        </ul>
      </div>
    </div>
  );
}
