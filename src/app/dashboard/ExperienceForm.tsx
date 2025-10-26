"use client";

import { useState } from "react";

const INITIAL_FORM = {
  Title: "",
  start: "",
  end: "",
  details: "",
};

export default function ExperienceForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setMessage(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add experience");

      setMessage("Experience saved successfully!");
      setFormData(INITIAL_FORM);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalFields = Object.keys(formData).length;
  const completedFields = Object.values(formData).filter(
    (value) => value.trim().length > 0
  ).length;
  const completion = Math.round((completedFields / totalFields) * 100);
  const detailsCharacters = formData.details.length;
  const normalizedMessage = message?.toLowerCase() ?? "";
  const isMessageSuccess = normalizedMessage.includes("success");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 pb-12 pt-10 text-slate-100 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.85)] backdrop-blur sm:px-10">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.22),transparent_65%)]"
      />

      <div className="relative flex flex-col gap-10">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              New entry
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              {completedFields}/{totalFields} complete
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Add Experience
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
              Capture highlights from your journey. Saved entries will appear instantly in the edit view and portfolio.
            </p>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 transition-all duration-500 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300">
              {completion}%
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label
                htmlFor="Title"
                className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
              >
                Title <span className="text-indigo-300">*</span>
              </label>
              <input
                id="Title"
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Software Engineer"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-400">
                Use a concise name that summarises the role or project.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="start"
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
                >
                  Start <span className="text-indigo-300">*</span>
                </label>
                <input
                  id="start"
                  type="text"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jan 2022"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-400">
                  Month & year work well. You can also use full dates.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="end"
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
                >
                  End <span className="text-indigo-300">*</span>
                </label>
                <input
                  id="end"
                  type="text"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Present or Dec 2023"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-400">
                  Use &quot;Present&quot; if this experience is ongoing.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="details"
                className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
              >
                Details <span className="text-indigo-300">*</span>
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={6}
                maxLength={600}
                required
                placeholder="Describe your responsibilities, achievements, and key tech used..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 placeholder:text-slate-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Highlight tangible outcomes or metrics if possible.</span>
                <span>{detailsCharacters}/600</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading || completedFields === 0}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(79,70,229,0.55)] transition hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 disabled:cursor-not-allowed disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500 disabled:text-slate-200"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {loading ? "Saving..." : "Add Experience"}
            </button>
          </div>
        </form>

        {message && (
          <div
            role="alert"
            aria-live="polite"
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium transition ${
              isMessageSuccess
                ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100 shadow-[0_0_35px_-20px_rgba(16,185,129,0.9)]"
                : "border-rose-400/60 bg-rose-500/10 text-rose-100 shadow-[0_0_35px_-20px_rgba(244,63,94,0.9)]"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isMessageSuccess
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "bg-rose-500/20 text-rose-100"
              }`}
            >
              {isMessageSuccess ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 12.5l3.5 3.5L18.5 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8v5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
