import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPortfolioByUsername,
  PortfolioExperience,
  slugifyUsername,
} from "../../../../lib/portfolio";

export const revalidate = 0;

interface PortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata(
  { params }: PortfolioPageProps
): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolioByUsername(username);

  if (!portfolio) {
    return { title: "Portfolio not found" };
  }

  return {
    title: `${portfolio.profile.name} - Portfolio`,
    description: `Experience timeline for ${portfolio.profile.name}`,
  };
}

const formatCounter = (index: number, total: number) => total - index;

const renderExperienceCard = (
  exp: PortfolioExperience,
  index: number,
  total: number
) => (
  <article
    key={exp.id}
    className="relative pb-12 last:pb-0"
    aria-label={`${exp.Title} from ${exp.start} to ${exp.end}`}
  >
    <span className="absolute -left-4 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-semibold text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.45)] md:-left-5">
      {formatCounter(index, total)}
    </span>
    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 px-6 py-6 transition duration-200 hover:border-emerald-400/40 hover:bg-slate-900 hover:shadow-[0_30px_60px_-40px_rgba(16,185,129,0.55)]">
      <time className="text-xs uppercase tracking-[0.4em] text-emerald-300/70">
        {exp.start} - {exp.end}
      </time>
      <h3 className="mt-3 text-xl font-semibold text-white">{exp.Title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {exp.details}
      </p>
    </div>
  </article>
);

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const portfolio = await getPortfolioByUsername(username);

  if (!portfolio) {
    notFound();
  }

  const { profile, experiences } = portfolio;
  const experienceCount = experiences.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
            Experience timeline
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {profile.name}
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            A curated selection of professional milestones and achievements.
          </p>
        </header>

        {experienceCount === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center text-sm text-slate-300">
            This portfolio has no experiences yet. Check back soon!
          </div>
        ) : (
          <section className="rounded-3xl border border-slate-800/80 bg-slate-900/60 px-8 py-10 shadow-[0_40px_80px_-45px_rgba(15,23,42,0.9)]">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-emerald-200">
                  Professional journey
                </h2>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {experienceCount} highlight{experienceCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="relative border-l border-slate-800/60 pl-8 md:pl-12">
              {experiences.map((exp, index) =>
                renderExperienceCard(exp, index, experienceCount)
              )}
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-slate-500">
          Share this page with{" "}
          <span className="font-semibold text-emerald-200">
            /portfolio/{slugifyUsername(profile.name)}
          </span>{" "}
          to showcase the timeline.
        </footer>
      </section>
    </main>
  );
}
