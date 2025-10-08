"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


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
   const router = useRouter();

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
    
    <section className="relative mx-auto mt-12 max-w-3xl px-6">

    
      

      <div
        aria-hidden
        className="absolute inset-x-10 -top-32 h-64 rounded-full bg-indigo-500/30 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.7)] backdrop-blur">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.18),transparent_60%)]"
        />

        <div className="relative rounded-3xl bg-white/95 px-8 pb-12 pt-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:px-12">
          <header className="flex flex-col gap-4 border-b border-slate-200/60 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                New Experience
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {completedFields}/{totalFields} fields complete
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Add Experience
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
                Capture highlights from your career journey. These details feed
                directly into your dashboard timeline.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 transition-all duration-500 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {completion}%
              </span>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="Title"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  Title <span className="text-indigo-500">*</span>
                </label>
                <input
                  id="Title"
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
                <p className="text-xs text-slate-400">
                  Use a concise name that summarises the role or project.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="start"
                    className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                  >
                    Start Date <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    id="start"
                    type="text"
                    name="start"
                    value={formData.start}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Jan 2022"
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="text-xs text-slate-400">
                    Month & year work well. You can also use full dates.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="end"
                    className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                  >
                    End Date <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    id="end"
                    type="text"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Present or Dec 2023"
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="text-xs text-slate-400">
                    Use "Present" if this experience is ongoing.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="details"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  Details <span className="text-indigo-500">*</span>
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
                  className="w-full resize-none rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Highlight tangible outcomes or metrics if possible.</span>
                  <span>{detailsCharacters}/600</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || completedFields === 0}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(79,70,229,0.55)] transition hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:text-slate-500"
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
              className={`mt-8 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium shadow-sm transition ${
                isMessageSuccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isMessageSuccess
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-rose-100 text-rose-600"
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
                    <circle
                      cx="12"
                      cy="16"
                      r="1"
                      fill="currentColor"
                    />
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
      </div>
    </section>
  );
}
