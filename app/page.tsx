"use client";

import Link from "next/link";
import {
  ArrowRight, Target, Map, Code2, Zap,
  CheckCircle2, BarChart3, Brain,
} from "lucide-react";

const features = [
  {
    icon: <Target size={20} />,
    title: "Resume Match",
    description: "Upload your resume and a job description. Get an AI-powered relevance score with a detailed gap analysis instantly.",
    href: "/resume-match",
    badge: "Score your fit",
    iconBg: "rgba(108,92,231,0.12)",
    iconBorder: "rgba(108,92,231,0.25)",
    iconColor: "var(--accent-light)",
  },
  {
    icon: <Map size={20} />,
    title: "Career Roadmap",
    description: "Tell us your target role and available hours. Get a personalised, week-by-week learning path built on your resume.",
    href: "/career-roadmap",
    badge: "Plan your path",
    iconBg: "rgba(0,206,201,0.12)",
    iconBorder: "rgba(0,206,201,0.25)",
    iconColor: "var(--success)",
  },
  {
    icon: <Code2 size={20} />,
    title: "DSA Roadmap",
    description: "Connect your LeetCode profile, pick your dream company. Get a targeted DSA prep plan based on your solved problems.",
    href: "/dsa-roadmap",
    badge: "Crack the coding round",
    iconBg: "rgba(253,203,110,0.12)",
    iconBorder: "rgba(253,203,110,0.25)",
    iconColor: "var(--warning)",
  },
];

const stats = [
  { value: "3", label: "AI-Powered Tools" },
  { value: "PDF+DOCX", label: "Resume Formats" },
  { value: "LeetCode", label: "Profile Analysis" },
  { value: "100+", label: "Companies Mapped" },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="animate-fade-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)" }}
          >
            <Zap size={12} style={{ color: "var(--accent-light)" }} />
            <span className="text-xs font-medium tracking-wide" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--accent-light)" }}>
              AI-Powered Career Intelligence
            </span>
          </div>

          <h1
            className="font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}
          >
            Land your dream role
            <span className="block" style={{ color: "var(--accent-light)" }}>with AI precision.</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}
          >
            Analyse resume fit, build personalised career roadmaps, and master DSA for your target company — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resume-match" className="btn-primary text-base px-8 py-3.5" style={{ boxShadow: "var(--shadow-glow)" }}>
              Start for free <ArrowRight size={18} />
            </Link>
            <Link href="/career-roadmap" className="btn-ghost text-base px-8 py-3.5">
              See how it works
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl animate-fade-up animate-delay-200"
          style={{ background: "var(--border)", border: "1px solid var(--border)" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-6 py-5" style={{ background: "var(--surface)" }}>
              <span className="font-bold text-xl" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
                {s.value}
              </span>
              <span className="text-xs" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <p className="label-text mb-3">What you get</p>
          <h2 className="font-semibold text-3xl" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
            Three tools. One goal.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              className="card p-6 group animate-fade-up"
              style={{
                animationDelay: `${i * 100 + 200}ms`,
                opacity: 0,
                animationFillMode: "forwards",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.iconBg, border: `1px solid ${f.iconBorder}` }}
              >
                <span style={{ color: f.iconColor }}>{f.icon}</span>
              </div>

              <p className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: f.iconColor, fontFamily: "DM Sans, sans-serif" }}>
                {f.badge}
              </p>

              <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}>
                {f.description}
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium" style={{ color: f.iconColor, fontFamily: "DM Sans, sans-serif" }}>
                Try it <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label-text mb-3">How it works</p>
              <h2 className="font-bold text-3xl leading-tight mb-6" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
                Intelligent career guidance,{" "}
                <span style={{ color: "var(--accent-light)" }}>not generic advice.</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <BarChart3 size={16} />, text: "Upload your resume (PDF/DOCX) — our AI extracts skills, roles, and experience" },
                  { icon: <Brain size={16} />, text: "LLM-powered analysis compares your profile against the role or company requirements" },
                  { icon: <CheckCircle2 size={16} />, text: "Get actionable, ranked recommendations you can act on today" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", color: "var(--accent-light)" }}
                    >
                      {item.icon}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/resume-match" className="btn-primary mt-8 w-fit text-sm">
                Try Resume Match <ArrowRight size={15} />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { label: "Profile Extraction", value: 95, color: "#6C5CE7" },
                { label: "JD Matching Accuracy", value: 88, color: "#00CEC9" },
                { label: "Roadmap Relevance", value: 92, color: "#FDCB6E" },
              ].map((item) => (
                <div key={item.label} className="card-elevated p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-primary)" }}>
                      {item.label}
                    </span>
                    <span className="font-bold text-sm" style={{ fontFamily: "Sora, sans-serif", color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="card p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.08) 0%, transparent 70%)" }}
          />
          <div className="relative">
            <h2 className="font-bold text-3xl md:text-4xl mb-4" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
              Ready to accelerate your career?
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}>
              Start with a free resume analysis and see how well you match your target role.
            </p>
            <Link href="/resume-match" className="btn-primary text-base px-10 py-4 inline-flex" style={{ boxShadow: "var(--shadow-glow)" }}>
              Analyse my resume <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
