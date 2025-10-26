"use client";

import { useEffect, useState } from "react";

interface Experience {
  _id: string;
  Title: string;
  start: string;
  end: string;
  details: string;
}

export default function DashboardPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experiences from backend
  const getUsers = async () => {
    try {
      const res = await fetch("/api/dashboard", {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch experiences");
      const data = await res.json();
      console.log("Fetched data:", data);

      setExperiences(data.experiences);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
            My experiences
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Welcome to your portfolio dashboard
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            This is my current timeline of experiences, showcasing my journey
            and growth over the years.
          </p>
        </header>

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-sm font-medium text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-800/60 bg-slate-900/60 px-6 py-6 shadow-lg shadow-slate-950/40"
              >
                <div className="h-4 w-24 rounded-full bg-slate-700/70" />
                <div className="mt-3 h-5 w-44 rounded-full bg-slate-700/50" />
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-800/60" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-800/40" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-800/40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center text-sm text-slate-300">
            Your timeline is waiting. Add your first experience to launch this
            space into life.
          </div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <section className="rounded-3xl border border-slate-800/80 bg-slate-900/60 px-8 py-10 shadow-[0_40px_80px_-45px_rgba(15,23,42,0.9)]">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-emerald-200">
                  Experience timeline
                </h2>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {experiences.length} curated highlight
                  {experiences.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="relative border-l border-slate-800/60 pl-8 md:pl-12">
              {experiences.map((exp, index) => (
                <article
                  key={exp._id}
                  className="relative pb-12 last:pb-0"
                  aria-label={`${exp.Title} from ${exp.start} to ${exp.end}`}
                >
                  <span className="absolute -left-4 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-semibold text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.45)] md:-left-5">
                    {experiences.length - index}
                  </span>
                  <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 px-6 py-6 transition duration-200 hover:border-emerald-400/40 hover:bg-slate-900 hover:shadow-[0_30px_60px_-40px_rgba(16,185,129,0.55)]">
                    <time className="text-xs uppercase tracking-[0.4em] text-emerald-300/70">
                      {exp.start} - {exp.end}
                    </time>
                    <h3 className="mt-3 text-xl font-semibold text-white">
                      {exp.Title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {exp.details}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
