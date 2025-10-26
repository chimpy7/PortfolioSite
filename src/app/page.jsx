"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyForm() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const onSubmit = async (formData) => {
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(result.message || "Unable to sign in.");
        return;
      }

      reset();
      router.push(result.redirectTo || "/dashboard");
    } catch (err) {
      setMessage("Error submitting form");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-16 text-white sm:px-6 lg:px-8">
      <section className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur transition">
        <div className="flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-10 p-8 sm:p-10 lg:p-12">
            <div className="space-y-3 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Portfolio Control Room
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back ! 
              </h1>
              <p className="text-sm text-white/70 sm:text-base">
                Sign in to publish new case studies, refresh project writeups, and keep your personal brand sharp.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email address
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/40 sm:px-5 sm:py-3.5 sm:text-base"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/40 sm:px-5 sm:py-3.5 sm:text-base"
                />
              </div>

              <div className="flex flex-col gap-2 text-left text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <p> Are you new here ?.</p>
                <a
                  href="/create"
                  className="font-semibold text-white transition hover:text-white/70"
                >
                Create new user 
                </a>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-0.5 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:px-6 sm:py-3.5 sm:text-base"
              >
                Sign in
              </button>

              {message && (
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/80 sm:text-base">
                  {message}
                </p>
              )}
            </form>

            <p className="text-center text-xs text-white/50 sm:text-sm lg:text-left">
              Reviewing on a new device? <span className="text-white/80">Reset your password</span>
            </p>
          </div>

          <aside className="relative hidden overflow-hidden border-t border-white/10 bg-slate-900/40 px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between lg:border-t-0 lg:border-l lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-400/15" />

            <div className="relative space-y-4">
              <h2 className="text-2xl font-semibold">First time managing the portfolio?</h2>
              <p className="text-sm text-white/75">
                Request access to help curate projects, polish case studies, and keep testimonials current.
              </p>
            </div>

            <ul className="relative space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Add new projects</p>
                  <p className="text-white/60">Showcase designs, code, and case studies with fresh visuals.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white">Publish insights</p>
                  <p className="text-white/60">Keep blog posts and experience highlights up to date.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white">Track engagement</p>
                  <p className="text-white/60">Review portfolio metrics and testimonials in one view.</p>
                </div>
              </li>
            </ul>

            <p className="relative text-sm text-white/75">
              Want to preview the live site? <a href="/" className="font-semibold text-white hover:text-white/80">Visit portfolio homepage</a>
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
