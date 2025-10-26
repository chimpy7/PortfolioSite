"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Experience = {
  _id: string;
  Title: string;
  start: string;
  end: string;
  details: string;
};

type FormState = {
  Title: string;
  start: string;
  end: string;
  details: string;
};

const EMPTY_FORM: FormState = {
  Title: "",
  start: "",
  end: "",
  details: "",
};

type ExperienceListPanelProps = {
  loading: boolean;
  error: string | null;
  experiences: Experience[];
  editingId: string | null;
  deletingId: string | null;
  onEditClick: (exp: Experience) => void;
  onDelete: (expId: string) => void;
};

function ExperienceListPanel({
  loading,
  error,
  experiences,
  editingId,
  deletingId,
  onEditClick,
  onDelete,
}: ExperienceListPanelProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.8)] backdrop-blur lg:col-span-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your experiences</h2>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
          {experiences.length} total
        </span>
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 p-4"
            >
              <div className="h-4 w-24 rounded bg-slate-700/60" />
              <div className="mt-3 h-3 w-40 rounded bg-slate-700/40" />
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded bg-slate-800/40" />
                <div className="h-2 w-5/6 rounded bg-slate-800/30" />
                <div className="h-2 w-2/3 rounded bg-slate-800/20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-rose-400/60 bg-rose-400/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ul className="space-y-3">
          {experiences.map((exp) => {
            const isActive = editingId === exp._id;
            return (
              <li
                key={exp._id}
                className={`group rounded-2xl border border-white/5 bg-slate-900/50 p-5 transition hover:border-emerald-400/60 hover:bg-slate-900/80 ${
                  isActive ? "border-emerald-400/60 bg-slate-900/80" : ""
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <time className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
                      {exp.start} - {exp.end}
                    </time>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {exp.Title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {exp.details}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClick(exp)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "border-emerald-400/70 bg-emerald-400/30 text-emerald-50"
                          : "border-emerald-400/50 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20"
                      }`}
                    >
                      {isActive ? "Editing" : "Edit entry"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(exp._id)}
                      disabled={deletingId === exp._id}
                      className="rounded-full border border-rose-400/60 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === exp._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {experiences.length === 0 && (
            <li className="rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-6 text-sm text-slate-300">
              No experiences yet. Add one from your dashboard to get started.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

type ExperienceEditorPanelProps = {
  editing: Experience | null;
  formData: FormState;
  saving: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

function ExperienceEditorPanel({
  editing,
  formData,
  saving,
  onChange,
  onCancel,
  onSubmit,
}: ExperienceEditorPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.85)] backdrop-blur lg:col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Edit details</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
            {editing ? "Active selection" : "Pick an experience"}
          </p>
        </div>
        {editing && (
          <span className="rounded-full border border-emerald-300/60 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Live
          </span>
        )}
      </div>

      {!editing && (
        <p className="mt-6 rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-5 text-sm text-slate-300">
          Select an experience from the list to start editing its details.
        </p>
      )}

      {editing && (
        <div className="mt-6 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Title
          </label>
          <input
            name="Title"
            value={formData.Title}
            onChange={onChange}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Start
              </label>
              <input
                name="start"
                value={formData.start}
                onChange={onChange}
                placeholder="Jan 2022"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                End
              </label>
              <input
                name="end"
                value={formData.end}
                onChange={onChange}
                placeholder="Present"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Details
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={onChange}
              placeholder="Summarize your impact, responsibilities, and key wins..."
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row md:justify-between">
            <button
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 shadow-[0_20px_45px_-20px_rgba(16,185,129,0.75)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving changes..." : "Save updates"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await res.json().catch(() => null);

        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to load experiences");
        }

        setExperiences(data?.experiences ?? []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load experiences";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  const handleEditClick = (exp: Experience) => {
    setMessage("");
    setError(null);
    setEditing(exp);
    setFormData({
      Title: exp.Title,
      start: exp.start,
      end: exp.end,
      details: exp.details,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData(() => ({ ...EMPTY_FORM }));
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!editing) return;

    setMessage("");
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expId: editing._id,
          updatedData: formData,
        }),
      });

      const result = await res.json().catch(() => null);

      if (res.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }

      if (!res.ok) {
        throw new Error(result?.error ?? "Failed to update experience");
      }

      if (result?.experience) {
        setExperiences((prev) =>
          prev.map((exp) =>
            exp._id === result.experience._id ? result.experience : exp
          )
        );
      }

      setMessage("Experience updated successfully!");
      setEditing(null);
      setFormData(() => ({ ...EMPTY_FORM }));
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Failed to update experience";
      setMessage(text);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expId: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this experience?"
      );
      if (!confirmed) {
        return;
      }
    }

    setMessage("");
    setError(null);
    setDeletingId(expId);

    try {
      const res = await fetch("/api/dashboard", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expId }),
      });

      const result = await res.json().catch(() => null);

      if (res.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }

      if (!res.ok) {
        throw new Error(result?.error ?? "Failed to delete experience");
      }

      setExperiences((prev) => prev.filter((exp) => exp._id !== expId));

      if (editing?._id === expId) {
        setEditing(null);
        setFormData(() => ({ ...EMPTY_FORM }));
      }

      setMessage("Experience deleted successfully!");
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Failed to delete experience";
      setMessage(text);
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedMessage = message.trim().toLowerCase();
  const isSuccessMessage =
    normalizedMessage.includes("success") ||
    normalizedMessage.includes("updated") ||
    normalizedMessage.includes("deleted");

  return (
   
    
    <main className="min-h-screen bg-slate-950 pb-16 pt-12 text-slate-100">
      
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:px-0">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Edit mode
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(79,70,229,0.55)] transition hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/60"
            >
              Back to Dashboard
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Curate your experience timeline
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
              Pick an entry, adjust the details, and publish the changes instantly.
            </p>
          </div>
          {message && (
            <div
              role="status"
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                isSuccessMessage
                  ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/60 bg-rose-400/10 text-rose-100"
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                  isSuccessMessage
                    ? "bg-emerald-500/20 text-emerald-100"
                    : "bg-rose-500/20 text-rose-100"
                }`}
              >
                {isSuccessMessage ? "OK" : "!"}
              </span>
              {message}
            </div>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <ExperienceListPanel
            loading={loading}
            error={error}
            experiences={experiences}
            editingId={editing?._id ?? null}
            deletingId={deletingId}
            onEditClick={handleEditClick}
            onDelete={handleDelete}
          />
          <ExperienceEditorPanel
            editing={editing}
            formData={formData}
            saving={saving}
            onChange={handleChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </main>
  );
}
