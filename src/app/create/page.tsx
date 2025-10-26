"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateUserSchema } from "../../../lib/myzodschema";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
};

const INITIAL_ERRORS = {
  name: "",
  email: "",
  password: "",
};

type ErrorState = typeof INITIAL_ERRORS;

export default function CreatePage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>(INITIAL_ERRORS);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setErrors(INITIAL_ERRORS);

    const validation = CreateUserSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      });
      setMessage("Please fix the highlighted fields.");
      return;
    }

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
      setErrors(INITIAL_ERRORS);
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

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-2xl border bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:outline-none focus:ring-2 ${
      hasError
        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/40"
        : "border-white/10 focus:border-emerald-300 focus:ring-emerald-300/40"
    }`;

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
                Passwords must include at least one uppercase letter, one lowercase letter,
                one number, and be 6 or more characters. Names must be at least 2 characters.
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
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClasses(Boolean(errors.name))}
              />
              {errors.name && (
                <p id="name-error" className="text-xs font-medium text-rose-300">
                  {errors.name}
                </p>
              )}
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
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClasses(Boolean(errors.email))}
              />
              {errors.email && (
                <p id="email-error" className="text-xs font-medium text-rose-300">
                  {errors.email}
                </p>
              )}
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
                placeholder="********"
                required
                minLength={6}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={inputClasses(Boolean(errors.password))}
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="text-xs font-medium text-rose-300"
                >
                  {errors.password}
                </p>
              )}
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
