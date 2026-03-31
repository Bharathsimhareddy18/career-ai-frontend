"use client";

import { useState } from "react";
import { Target, AlertCircle, RotateCcw } from "lucide-react";
import FileDropzone from "@/components/ui/FileDropzone";
import ScoreRing from "@/components/ui/ScoreRing";
import LoadingState from "@/components/ui/LoadingState";
import PageHero from "@/components/ui/PageHero";
import { getRelevanceScore } from "@/lib/api";

interface Result {
  score: number;
  difference: unknown;
}

export default function ResumeMatchPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = resumeFile && jdFile && !loading;

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getRelevanceScore(resumeFile, jdFile);
      if (data.Error) {
        setError(data.Error);
        return;
      }
      const scoreRaw =
        data["Resume and JD relevence score is"] ??
        data["Resume and JD relevance score is"] ??
        "0";
      setResult({
        score: parseInt(scoreRaw, 10),
        difference: data.Difference ?? "",
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setResumeFile(null);
    setJdFile(null);
  };

  // Handles string OR the structured object your backend returns
  const parseDifference = (diff: unknown): string[] => {
    if (!diff) return [];

    // If it's already a plain string (after backend fix)
    if (typeof diff === "string") {
      return diff
        .split(/\n|•|-(?=\s)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);
    }

    // If backend returns structured object like:
    // { analysis_summary, key_gaps: [], improvement_actions: [] }
    if (typeof diff === "object" && diff !== null) {
      const obj = diff as Record<string, unknown>;
      const lines: string[] = [];

      if (typeof obj.analysis_summary === "string" && obj.analysis_summary) {
        lines.push(obj.analysis_summary);
      }

      if (Array.isArray(obj.key_gaps)) {
        obj.key_gaps.forEach((g) => {
          if (typeof g === "string") lines.push(g);
        });
      }

      if (Array.isArray(obj.improvement_actions)) {
        obj.improvement_actions.forEach((a) => {
          if (typeof a === "string") lines.push(a);
        });
      }

      return lines.filter((s) => s.length > 5);
    }

    return [];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <PageHero
        badge="Resume Match"
        title="How well does your resume fit the role?"
        subtitle="Upload your resume and the job description. Our AI computes a match score and highlights the exact gaps."
        icon={<Target size={13} />}
      />

      {!result && !loading && (
        <div className="card p-6 md:p-8 animate-fade-up space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileDropzone
              label="Your Resume"
              file={resumeFile}
              onFile={setResumeFile}
              hint="Upload your current resume"
            />
            <FileDropzone
              label="Job Description"
              file={jdFile}
              onFile={setJdFile}
              hint="Upload the JD you're targeting"
            />
          </div>

          {error && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 animate-fade-in"
              style={{
                background: "rgba(225,112,85,0.1)",
                border: "1px solid rgba(225,112,85,0.25)",
              }}
            >
              <AlertCircle
                size={16}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "var(--danger)" }}
              />
              <p
                className="text-sm"
                style={{
                  color: "var(--danger)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <p
              className="text-xs"
              style={{
                color: "var(--text-muted)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              ⏱ Analysis takes 10–20 seconds
            </p>
            <button
              className="btn-primary px-8 py-3"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <Target size={16} /> Analyse Match
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="card p-8 animate-fade-in">
          <LoadingState message="Analysing your resume against the JD..." />
        </div>
      )}

      {result && (
        <div className="space-y-5 animate-fade-up">
          {/* Score card */}
          <div className="card p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={result.score} size={160} />
            <div className="flex-1">
              <p className="label-text mb-3">Match Analysis</p>
              <h2
                className="font-bold text-2xl mb-2"
                style={{
                  fontFamily: "Sora, sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {result.score >= 75
                  ? "You're a strong candidate for this role."
                  : result.score >= 50
                    ? "Moderate fit — some upskilling needed."
                    : "Significant gaps identified — room to grow."}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--text-secondary)",
                }}
              >
                Based on your skills and experience vs. the job requirements,
                your AI match score is{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {result.score}/100
                </span>
                .
              </p>
              <button
                onClick={reset}
                className="btn-primary text-sm py-2.5 mt-5"
              >
                <RotateCcw size={14} /> Try another
              </button>
            </div>
          </div>

          {/* Gap analysis */}
          {result.difference && (
            <div className="card p-6 md:p-8">
              <p className="label-text mb-4">Gap Analysis</p>
              <div className="space-y-2.5">
                {parseDifference(result.difference).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 animate-fade-up"
                    style={{
                      animationDelay: `${i * 60}ms`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(108,92,231,0.12)",
                        border: "1px solid rgba(108,92,231,0.22)",
                      }}
                    >
                      <span
                        className="text-[9px] font-bold"
                        style={{
                          fontFamily: "Sora, sans-serif",
                          color: "var(--accent-light)",
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}