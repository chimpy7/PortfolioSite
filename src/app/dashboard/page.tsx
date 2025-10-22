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
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {portfolioSlug ? (
          <Link
            href={`/portfolio/${portfolioSlug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(79,70,229,0.55)] transition hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Go to My Portfolio
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-500">
            Portfolio unavailable
          </span>
        )}
      </div>
      <ExperienceForm />
    </main>
  );
}
