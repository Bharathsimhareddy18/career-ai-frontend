"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Wrench,
  AlertTriangle,
  Calendar,
  Layers,
  CheckSquare,
  Link2,
} from "lucide-react";

interface RoadmapRendererProps {
  roadmap: Record<string, unknown>;
}

// Try to extract weeks array from any shape
function extractWeeks(roadmap: Record<string, unknown>): Array<Record<string, unknown>> {
  if (Array.isArray(roadmap.weeks)) return roadmap.weeks as Array<Record<string, unknown>>;
  if (Array.isArray(roadmap.weekly_plan)) return roadmap.weekly_plan as Array<Record<string, unknown>>;
  if (Array.isArray(roadmap.plan)) return roadmap.plan as Array<Record<string, unknown>>;

  // Check for numbered week keys: week_1, week1, "Week 1"
  const weekEntries: Array<[number, Record<string, unknown>]> = [];
  for (const [k, v] of Object.entries(roadmap)) {
    const m = k.match(/week[_\s]?(\d+)/i);
    if (m && typeof v === "object" && v !== null) {
      weekEntries.push([parseInt(m[1]), v as Record<string, unknown>]);
    }
  }
  if (weekEntries.length > 0) {
    return weekEntries.sort((a, b) => a[0] - b[0]).map(([num, v]) => ({ week: num, ...v }));
  }
  return [];
}

function extractTopLevel(roadmap: Record<string, unknown>) {
  const weekKeys = new Set<string>();
  for (const k of Object.keys(roadmap)) {
    if (/week/i.test(k) || k === "weeks" || k === "weekly_plan" || k === "plan") {
      weekKeys.add(k);
    }
  }

  const top: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(roadmap)) {
    if (!weekKeys.has(k)) top[k] = v;
  }
  return top;
}

const sectionIconMap: Record<string, React.ReactNode> = {
  topics: <BookOpen size={13} />,
  skills: <BookOpen size={13} />,
  learning: <BookOpen size={13} />,
  tasks: <CheckSquare size={13} />,
  objectives: <Target size={13} />,
  goals: <Target size={13} />,
  projects: <Wrench size={13} />,
  resources: <Link2 size={13} />,
  links: <Link2 size={13} />,
  focus: <Layers size={13} />,
  warnings: <AlertTriangle size={13} />,
  gaps: <AlertTriangle size={13} />,
};

function getIcon(key: string) {
  const lower = key.toLowerCase();
  for (const [k, icon] of Object.entries(sectionIconMap)) {
    if (lower.includes(k)) return icon;
  }
  return <Layers size={13} />;
}

function StringList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-light mt-[7px] flex-shrink-0" />
          <span className="text-sm font-dm text-[var(--text-secondary)] leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function renderAnyValue(val: unknown, depth = 0): React.ReactNode {
  if (val === null || val === undefined) return null;

  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    return <p className="text-sm font-dm text-[var(--text-secondary)]">{String(val)}</p>;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    // Array of strings
    if (val.every((v) => typeof v === "string" || typeof v === "number")) {
      return <StringList items={val.map(String)} />;
    }
    // Array of objects
    return (
      <div className="space-y-3">
        {val.map((item, i) => (
          <div key={i} className="pl-3 border-l-2 border-[rgba(108,92,231,0.25)]">
            {typeof item === "object" && item !== null
              ? renderAnyValue(item, depth + 1)
              : <p className="text-sm font-dm text-[var(--text-secondary)]">{String(item)}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (typeof val === "object" && val !== null) {
    const entries = Object.entries(val as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return null;
    return (
      <div className={`space-y-4 ${depth > 0 ? "" : ""}`}>
        {entries.map(([k, v]) => {
          if (["is_valid_document", "valid"].includes(k.toLowerCase())) return null;
          return (
            <div key={k}>
              <p className="text-[10px] font-dm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">
                {k.replace(/_/g, " ")}
              </p>
              {renderAnyValue(v, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function WeekCard({ week, index }: { week: Record<string, unknown>; index: number }) {
  const [open, setOpen] = useState(index === 0);

  const weekNum = week.week ?? week.week_number ?? index + 1;
  const title =
    (week.title as string) ??
    (week.theme as string) ??
    (week.focus as string) ??
    `Week ${weekNum}`;

  const subEntries = Object.entries(week).filter(
    ([k]) => !["week", "week_number", "title", "theme"].includes(k.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 flex-shrink-0">
          <span className="font-sora font-bold text-sm text-accent-light">{String(weekNum)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-sora font-semibold text-[var(--text-primary)] truncate">{title}</p>
          {!open && subEntries.length > 0 && (
            <p className="text-xs text-[var(--text-muted)] font-dm mt-0.5">
              {subEntries.map(([k]) => k.replace(/_/g, " ")).slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-dm">
            <Calendar size={10} />
            Week {String(weekNum)}
          </span>
          {open ? (
            <ChevronUp size={16} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--text-muted)]" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-[var(--border)] space-y-5">
          {subEntries.map(([k, v]) => {
            if (v === null || v === undefined) return null;
            const isEmpty = Array.isArray(v) ? v.length === 0 : false;
            if (isEmpty) return null;

            return (
              <div key={k}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-accent-light">{getIcon(k)}</span>
                  <p className="text-[10px] font-dm font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                    {k.replace(/_/g, " ")}
                  </p>
                </div>
                {renderAnyValue(v)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopLevelSection({ label, value }: { label: string; value: unknown }) {
  const [open, setOpen] = useState(true);
  if (value === null || value === undefined) return null;
  if (["is_valid_document", "valid", "target_role"].includes(label.toLowerCase())) return null;

  const isComplex = typeof value === "object";

  return (
    <div className="card p-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-accent-light">{getIcon(label)}</span>
          <p className="text-sm font-sora font-semibold text-[var(--text-primary)]">
            {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
        </div>
        {isComplex && (
          open ? <ChevronUp size={15} className="text-[var(--text-muted)] flex-shrink-0" /> :
                 <ChevronDown size={15} className="text-[var(--text-muted)] flex-shrink-0" />
        )}
      </button>

      {(!isComplex || open) && (
        <div className="mt-3">
          {renderAnyValue(value)}
        </div>
      )}
    </div>
  );
}

export default function RoadmapRenderer({ roadmap }: RoadmapRendererProps) {
  const weeks = extractWeeks(roadmap);
  const topLevel = extractTopLevel(roadmap);

  const targetRole = (roadmap.target_role ?? roadmap.role ?? "") as string;
  const estimatedWeeks = roadmap.estimated_total_weeks ?? roadmap.total_weeks ?? weeks.length;

  return (
    <div className="space-y-5">
      {/* Header summary row */}
      {(targetRole || estimatedWeeks) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {targetRole && (
            <div className="card p-4 col-span-2 sm:col-span-1">
              <p className="label-text mb-1">Target Role</p>
              <p className="text-base font-sora font-bold text-[var(--text-primary)] capitalize">{targetRole}</p>
            </div>
          )}
          {estimatedWeeks && (
            <div className="card p-4">
              <p className="label-text mb-1">Duration</p>
              <p className="text-base font-sora font-bold text-accent-light">{String(estimatedWeeks)} weeks</p>
            </div>
          )}
          {weeks.length > 0 && (
            <div className="card p-4">
              <p className="label-text mb-1">Phases</p>
              <p className="text-base font-sora font-bold text-[var(--text-primary)]">{weeks.length} weeks planned</p>
            </div>
          )}
        </div>
      )}

      {/* Top-level non-week sections */}
      {Object.entries(topLevel)
        .filter(([k]) => !["target_role", "role", "estimated_total_weeks", "total_weeks"].includes(k))
        .map(([k, v]) => (
          <TopLevelSection key={k} label={k} value={v} />
        ))}

      {/* Weekly plan */}
      {weeks.length > 0 && (
        <div>
          <p className="label-text mb-3">Weekly Plan</p>
          <div className="space-y-2">
            {weeks.map((week, i) => (
              <WeekCard key={i} week={week} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Fallback if no structured weeks found */}
      {weeks.length === 0 && Object.keys(topLevel).length === 0 && (
        <div className="card p-6">
          <pre className="text-xs text-[var(--text-secondary)] font-dm whitespace-pre-wrap overflow-x-auto leading-relaxed">
            {JSON.stringify(roadmap, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
