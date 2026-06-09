"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
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
          <div>
            <label className="font-display mb-2 block text-[0.88rem] font-medium tracking-[0.02em] text-white/78">
              Fjalëkalimi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="font-ui w-full border-b border-[#262626] bg-transparent py-3 text-[14px] font-light tracking-[0.3px] text-white outline-none transition-colors duration-300 focus:border-accent"
            />
          </div>

          {error && <p className="text-[12px] text-red-400/80">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="font-ui mt-2 w-full rounded-[2px] bg-accent px-8 py-4 text-[12px] font-bold tracking-[1px] text-[#0a0a0a] transition-all duration-500 ease-in-out hover:shadow-[0_0_28px_rgba(171,131,57,0.45),0_0_56px_rgba(171,131,57,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Duke hyrë…" : "Hyr"}
          </button>
        </form>
      </div>
    </main>
  );
}
