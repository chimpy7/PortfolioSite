import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import ExperienceForm from "./ExperienceForm";
import { slugifyUsername } from "../../../lib/portfolio";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("DashboardToken")?.value;
  let username: string | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        username: string;
      };
      username = decoded.username;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  const portfolioSlug = username ? slugifyUsername(username) : null;

  return (
    <main className="min-h-screen bg-slate-950 pb-16 pt-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:px-0">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Create mode
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(16,185,129,0.45)] transition hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                Manage Experiences
              </Link>
              {portfolioSlug ? (
                <Link
                  href={`/portfolio/${portfolioSlug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(79,70,229,0.55)] transition hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  View Portfolio
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-400">
                  Portfolio unavailable
                </span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Build your experience timeline
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
              Add new roles and accomplishments. They will appear instantly in the edit view and your public portfolio.
            </p>
          </div>
        </header>

        <ExperienceForm />
      </div>
    </main>
  );
}
