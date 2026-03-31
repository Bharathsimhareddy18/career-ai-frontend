"use client";

import { useState } from "react";
import {
  Code2, AlertCircle, Search, Building2,
  Calendar, ExternalLink, Trophy, RotateCcw,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import StepProgressLoader, { ProgressStep } from "@/components/ui/StepProgressLoader";
import RoadmapRenderer from "@/components/ui/RoadmapRenderer";
import { getDsaRoadmap, getDsaConfig } from "@/lib/api";

const DSA_STEPS: ProgressStep[] = [
  {
    id: "fetch",
    label: "Fetching your LeetCode profile",
    detail: "Pulling solved problems, streaks, and difficulty breakdown",
    durationMs: 5000,
  },
  {
    id: "company",
    label: "Loading company question bank",
    detail: "Finding the most relevant DSA patterns for your target company",
    durationMs: 6000,
  },
  {
    id: "gap",
    label: "Analysing your gaps",
    detail: "Comparing your solved problems against company-specific patterns",
    durationMs: 10000,
  },
  {
    id: "roadmap",
    label: "Building your prep plan",
    detail: "Scheduling topics and questions based on your available time",
    durationMs: 15000,
  },
  {
    id: "final",
    label: "Adding resources & tips",
    detail: "Attaching editorial links and difficulty-adjusted recommendations",
    durationMs: 8000,
  },
];

type CompanyMap = Record<string, string>;

interface DsaResult {
  userData: Record<string, unknown>;
  roadmap: Record<string, unknown>;
}

function UserStatsCard({
  userData,
  leetcodeUrl,
}: {
  userData: Record<string, unknown>;
  leetcodeUrl: string;
}) {
  const simple = Object.entries(userData).filter(
    ([, v]) => v !== null && typeof v !== "object"
  );

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(253,203,110,0.12)", border: "1px solid rgba(253,203,110,0.25)" }}
          >
            <Trophy size={16} style={{ color: "var(--warning)" }} />
          </div>
          <p className="label-text">LeetCode Profile</p>
        </div>
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "var(--accent-light)", fontFamily: "DM Sans, sans-serif" }}
        >
          View profile <ExternalLink size={10} />
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {simple.slice(0, 8).map(([k, v]) => (
          <div key={k} className="card-elevated px-4 py-3 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {k.replace(/_/g, " ")}
            </p>
            <p className="text-base font-bold" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
              {String(v)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DsaRoadmapPage() {
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [timePeriod, setTimePeriod] = useState("30");
  const [loading, setLoading] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [result, setResult] = useState<DsaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyMap | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const canSubmit = leetcodeUrl.trim() && targetCompany.trim() && timePeriod && !loading;

  const loadCompanies = async () => {
    if (companies) { setShowPicker(true); return; }
    setLoadingCompanies(true);
    try {
      const data = await getDsaConfig();
      setCompanies(data);
      setShowPicker(true);
    } catch { /* silent */ }
    finally { setLoadingCompanies(false); }
  };

  const filteredCompanies = companies
    ? Object.keys(companies).filter((c) => c.toLowerCase().includes(companySearch.toLowerCase()))
    : [];

  const handleSubmit = async () => {
    setLoading(true);
    setApiDone(false);
    setError(null);
    setResult(null);
    try {
      const data = await getDsaRoadmap(leetcodeUrl, targetCompany, parseInt(timePeriod));
      setApiDone(true);
      if (data.Error) { setError(data.Error); setLoading(false); return; }
      await new Promise((r) => setTimeout(r, 800));
      setResult({
        userData: data.User_data ?? data.user_data ?? {},
        roadmap: data.Roadmap ?? data.roadmap ?? {},
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setApiDone(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setApiDone(false);
    setLeetcodeUrl("");
    setTargetCompany("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <PageHero
        badge="DSA Roadmap"
        title="Prep smart for your target company."
        subtitle="Connect your LeetCode profile and pick a company. We'll analyse your gaps and build a targeted DSA prep plan."
        icon={<Code2 size={13} />}
      />

      {/* Form */}
      {!result && !loading && (
        <div className="card p-6 md:p-8 animate-fade-up space-y-6">
          {/* LeetCode URL */}
          <div className="space-y-2">
            <label className="label-text flex items-center gap-1.5">
              <Trophy size={11} />
              LeetCode Profile URL
            </label>
            <input
              className="input-field"
              placeholder="https://leetcode.com/u/your-username"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
              Profile must be public · format:{" "}
              <code
                className="px-1.5 py-0.5 rounded text-xs"
                style={{ background: "rgba(108,92,231,0.12)", color: "var(--accent-light)" }}
              >
                leetcode.com/u/username
              </code>
            </p>
          </div>

          {/* Company selector */}
          <div className="space-y-2">
            <label className="label-text flex items-center gap-1.5">
              <Building2 size={11} />
              Target Company
            </label>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="e.g. Google, Amazon, Flipkart"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
              />
              <button
                onClick={loadCompanies}
                disabled={loadingCompanies}
                className="btn-ghost text-sm px-4 flex-shrink-0"
              >
                <Search size={14} />
                {loadingCompanies ? "Loading…" : "Browse"}
              </button>
            </div>

            {/* Company picker */}
            {showPicker && companies && (
              <div
                className="rounded-2xl overflow-hidden animate-fade-in"
                style={{ border: "1px solid var(--border)", background: "var(--surface-elevated)" }}
              >
                <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      className="input-field pl-8 py-2 text-sm"
                      placeholder="Search companies…"
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCompanies.slice(0, 30).map((company) => (
                    <button
                      key={company}
                      onClick={() => { setTargetCompany(company); setShowPicker(false); setCompanySearch(""); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{company}</span>
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        {companies[company]}
                      </span>
                    </button>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <p className="text-center text-sm py-6" style={{ color: "var(--text-secondary)" }}>No companies found</p>
                  )}
                </div>
                <div className="p-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setShowPicker(false)}
                    className="w-full text-xs py-1.5 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Time period */}
          <div className="space-y-2">
            <label className="label-text flex items-center gap-1.5">
              <Calendar size={11} />
              Days Until Interview
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["7", "14", "30", "60"].map((d) => (
                <button
                  key={d}
                  onClick={() => setTimePeriod(d)}
                  className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    background: timePeriod === d ? "rgba(108,92,231,0.18)" : "var(--surface-elevated)",
                    border: `1px solid ${timePeriod === d ? "rgba(108,92,231,0.4)" : "var(--border)"}`,
                    color: timePeriod === d ? "var(--accent-light)" : "var(--text-secondary)",
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
            <input
              type="number"
              className="input-field text-sm"
              placeholder="Or enter custom number of days"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            />
          </div>

          {error && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 animate-fade-in"
              style={{ background: "rgba(225,112,85,0.1)", border: "1px solid rgba(225,112,85,0.25)" }}
            >
              <AlertCircle size={16} style={{ color: "var(--danger)" }} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm" style={{ color: "var(--danger)", fontFamily: "DM Sans, sans-serif" }}>{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>
              ⏱ Analysis takes 30–50 seconds
            </p>
            <button className="btn-primary px-8 py-3" onClick={handleSubmit} disabled={!canSubmit}>
              <Code2 size={16} />
              Generate DSA Plan
            </button>
          </div>
        </div>
      )}

      {/* Step loader */}
      {loading && (
        <div className="card p-6 md:p-8 animate-fade-in">
          <div className="text-center mb-6">
            <p className="font-semibold text-lg" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
              Analysing your LeetCode profile
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Targeting <span style={{ color: "var(--accent-light)" }}>{targetCompany}</span> · {timePeriod} days to go
            </p>
          </div>
          <StepProgressLoader steps={DSA_STEPS} isComplete={apiDone} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-up">
          <UserStatsCard userData={result.userData} leetcodeUrl={leetcodeUrl} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-text">DSA Roadmap — {targetCompany}</p>
              <button onClick={reset} className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
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
