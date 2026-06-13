"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [step, setStep] = useState<"password" | "token">("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token: token || undefined, rememberDevice }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else if (data.requires2fa) {
        // Fjalëkalimi i saktë — kërkohet kodi nga aplikacioni autentifikues
        setStep("token");
        setError(data.error ?? "");
      } else {
        setError(data.error ?? "Fjalëkalim i gabuar.");
      }
    } catch {
      setError("Gabim lidhjeje. Provoni sërish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 text-text">
      <div className="w-full max-w-sm rounded-[1.5rem] border border-[#262626] bg-[rgba(10,10,10,0.72)] p-8 backdrop-blur-[12px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/55">Illyrian Pixel</p>
        <h1 className="mt-3 font-display text-[1.6rem] font-bold text-white">Admin</h1>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div className={step === "token" ? "hidden" : ""}>
            <label className="font-display mb-2 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
              Fjalëkalimi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="font-ui w-full border-b border-[#262626] bg-transparent py-3 pr-9 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/35 transition-colors hover:text-white/70"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {step === "token" && (
            <div>
              <label className="font-display mb-2 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
                Kodi 2FA
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                autoFocus
                placeholder="000000"
                className="w-full border-b border-[#262626] bg-transparent py-3 text-center font-mono text-[22px] tracking-[0.4em] text-white outline-none transition-colors duration-300 focus:border-accent"
              />
              <p className="mt-2 text-[11px] text-white/35">
                Shkruaj kodin 6-shifror nga aplikacioni autentifikues.
              </p>
              <label className="mt-3 flex items-center gap-2 text-[12px] text-white/55">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#ab8339]"
                />
                Mbaj mend këtë pajisje për 3 muaj
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setToken("");
                  setError("");
                }}
                className="mt-2 text-[11px] text-white/35 transition-colors hover:text-white/70"
              >
                ← Kthehu te fjalëkalimi
              </button>
            </div>
          )}

          {error && <p className="text-[12px] text-red-400/80">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password || (step === "token" && token.length !== 6)}
            className="font-ui mt-2 w-full rounded-[2px] bg-accent px-8 py-4 text-[12px] font-bold tracking-[1px] text-[#0a0a0a] transition-all duration-500 ease-in-out hover:shadow-[0_0_28px_rgba(171,131,57,0.45),0_0_56px_rgba(171,131,57,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Duke hyrë…" : step === "token" ? "Verifiko" : "Hyr"}
          </button>
        </form>
      </div>
    </main>
  );
}
