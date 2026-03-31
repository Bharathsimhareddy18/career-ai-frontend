"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const navLinks = [
  { href: "/resume-match", label: "Resume Match" },
  { href: "/career-roadmap", label: "Career Roadmap" },
  { href: "/dsa-roadmap", label: "DSA Roadmap" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: "var(--navbar-bg)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)" }}
          >
            <Zap size={15} style={{ color: "var(--accent-light)" }} />
          </div>
          <span className="font-semibold text-base tracking-tight" style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}>
            Career<span style={{ color: "var(--accent-light)" }}>AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  background: active ? "rgba(108,92,231,0.12)" : "transparent",
                  color: active ? "var(--accent-light)" : "var(--text-secondary)",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="hidden md:block">
            <Link href="/resume-match" className="btn-primary text-sm py-2 px-5">Get Started</Link>
          </div>

          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden px-4 py-4 space-y-1 animate-fade-in"
          style={{ borderTop: "1px solid var(--border)", background: "var(--navbar-bg)" }}
        >
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  background: active ? "rgba(108,92,231,0.12)" : "transparent",
                  color: active ? "var(--accent-light)" : "var(--text-secondary)",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/resume-match" onClick={() => setOpen(false)} className="btn-primary text-sm w-full">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
