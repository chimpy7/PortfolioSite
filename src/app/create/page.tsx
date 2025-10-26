"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
};

export default function CreatePage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
   const router = useRouter();
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    

    try {
      const res = await fetch("/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create user");
      }

      setMessage("User created successfully!");
      setFormData(INITIAL_FORM);
      router.push("/");
      
      
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to create user";
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message?.toLowerCase().includes("success");


  return (
    <main className="min-h-screen bg-slate-950 pb-20 pt-16 text-slate-100">
      <div className="mx-auto w-full max-w-xl px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_100px_-60px_rgba(15,23,42,0.85)] backdrop-blur">
          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              New user
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create a profile
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Fill in the details below to add a new user record.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_25px_65px_-30px_rgba(16,185,129,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating user..." : "Create user"}
            </button>
          </form>

          {message && (
            <div
              role="alert"
              className={`mt-8 rounded-2xl border px-5 py-4 text-sm font-medium ${
                isSuccess
                  ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/60 bg-rose-400/10 text-rose-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
