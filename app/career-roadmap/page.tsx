"use client";

import { useState } from "react";
import { Map, AlertCircle, Clock, Briefcase, User, RotateCcw } from "lucide-react";
import FileDropzone from "@/components/ui/FileDropzone";
import PageHero from "@/components/ui/PageHero";
import StepProgressLoader, { ProgressStep } from "@/components/ui/StepProgressLoader";
import RoadmapRenderer from "@/components/ui/RoadmapRenderer";
import { getCareerRoadmap } from "@/lib/api";

const CAREER_STEPS: ProgressStep[] = [
  {
    id: "parse",
    label: "Parsing your resume",
    detail: "Extracting skills, roles, and experience from your document",
    durationMs: 4000,
  },
  {
    id: "distill",
    label: "Building your profile",
    detail: "Running LLM distillation to create a structured candidate profile",
    durationMs: 8000,
  },
  {
    id: "analyse",
    label: "Analysing skill gaps",
    detail: "Comparing your profile against the target role requirements",
    durationMs: 12000,
  },
  {
    id: "plan",
    label: "Planning your roadmap",
    detail: "Generating a personalised week-by-week learning schedule",
    durationMs: 18000,
  },
  {
    id: "finalise",
    label: "Finalising your plan",
    detail: "Adding resources, milestones, and project recommendations",
    durationMs: 8000,
  },
];

interface UserProfile {
  name?: string;
  current_role?: string;
  technical_skills?: string | string[];
  years_of_experience?: number | string;
  project_complexity_level?: string;
  [key: string]: unknown;
}

interface Result {
  profile: UserProfile;
  roadmap: Record<string, unknown>;
}

function ProfileCard({ profile }: { profile: UserProfile }) {
  const skip = new Set(["is_valid_document", "valid", "email"]);
  const entries = Object.entries(profile).filter(
    ([k, v]) => !skip.has(k) && v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return null;

  const renderVal = (v: unknown) => {
    if (Array.isArray(v)) return v.join(", ");
    return String(v);
  };

  const labelMap: Record<string, string> = {
    name: "Name",
    current_role: "Current Role",
    technical_skills: "Skills",
    years_of_experience: "Experience",
    project_complexity_level: "Level",
    education: "Education",
    certifications: "Certifications",
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,206,201,0.12)", border: "1px solid rgba(0,206,201,0.25)" }}
        >
          <User size={16} style={{ color: "var(--success)" }} />
        </div>
        <p className="label-text">Extracted Profile</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.slice(0, 6).map(([k, v]) => (
          <div key={k} className="card-elevated px-4 py-3 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {labelMap[k] ?? k.replace(/_/g, " ")}
            </p>
            <p
              className="text-sm font-medium truncate"
              style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-primary)" }}
            >
              {renderVal(v)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CareerRoadmapPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [hours, setHours] = useState("2");
  const [loading, setLoading] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = resumeFile && jobRole.trim() && hours && !loading;

  const handleSubmit = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setApiDone(false);
    setError(null);
    setResult(null);

    try {
      const data = await getCareerRoadmap(resumeFile, jobRole, parseFloat(hours));
      setApiDone(true);

      if (data.Error) {
        setError(data.Error);
        setLoading(false);
        return;
      }

      const profile = data["User profile"] ?? data.user_profile ?? {};
      const roadmap = data.result ?? data.roadmap ?? {};

      // Small delay so users see the final step complete
      await new Promise((r) => setTimeout(r, 800));

      setResult({ profile, roadmap });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setApiDone(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setApiDone(false);
    setResumeFile(null);
    setJobRole("");
    setHours("2");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <PageHero
        badge="Career Roadmap"
        title="Your personalised path to the next role."
        subtitle="Upload your resume, tell us your target role and available hours. We'll build a week-by-week learning plan tailored to your profile."
        icon={<Map size={13} />}
      />

      {/* Input form */}
      {!result && !loading && (
        <div className="card p-6 md:p-8 animate-fade-up space-y-6">
          <FileDropzone label="Your Resume" file={resumeFile} onFile={setResumeFile} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="label-text flex items-center gap-1.5">
                <Briefcase size={11} />
                Target Job Role
              </label>
              <input
                className="input-field"
                placeholder="e.g. ML Engineer, Data Scientist"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canSubmit && handleSubmit()}
              />
            </div>
            <div className="space-y-2">
              <label className="label-text flex items-center gap-1.5">
                <Clock size={11} />
                Hours Available per Day
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {["1", "2", "4", "6"].map((h) => (
                    <button
                      key={h}
                      onClick={() => setHours(h)}
                      className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        background: hours === h ? "rgba(108,92,231,0.18)" : "var(--surface-elevated)",
                        border: `1px solid ${hours === h ? "rgba(108,92,231,0.4)" : "var(--border)"}`,
                        color: hours === h ? "var(--accent-light)" : "var(--text-secondary)",
                      }}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  className="input-field text-sm"
                  placeholder="Or type custom hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 animate-fade-in"
              style={{ background: "rgba(225,112,85,0.1)", border: "1px solid rgba(225,112,85,0.25)" }}
            >
              <AlertCircle size={16} style={{ color: "var(--danger)" }} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm" style={{ color: "var(--danger)", fontFamily: "DM Sans, sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
              ⏱ Roadmap generation takes 30–50 seconds
            </p>
            <button className="btn-primary px-8 py-3" onClick={handleSubmit} disabled={!canSubmit}>
              <Map size={16} />
              Generate Roadmap
            </button>
          </div>
        </div>
      )}

      {/* Step-by-step loader */}
      {loading && (
        <div className="card p-6 md:p-8 animate-fade-in">
          <div className="text-center mb-6">
            <p
              className="font-semibold text-lg"
              style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}
            >
              Building your roadmap
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              For <span style={{ color: "var(--accent-light)" }}>{jobRole}</span> — sit tight, this is worth the wait
            </p>
          </div>
          <StepProgressLoader steps={CAREER_STEPS} isComplete={apiDone} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-up">
          {/* Profile */}
          <ProfileCard profile={result.profile} />

          {/* Roadmap */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-text">Your Roadmap — {jobRole}</p>
              <button
                onClick={reset}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <RotateCcw size={12} />
                Start over
              </button>
            </div>
            <RoadmapRenderer roadmap={result.roadmap} />
          </div>
        </div>
      )}
    </div>
  );
}
