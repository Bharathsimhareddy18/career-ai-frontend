import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        dm: ["var(--font-dm)", "sans-serif"],
      },
      colors: {
        bg: "#07070E",
        surface: "#0D0D1A",
        elevated: "#12121F",
        border: "rgba(255,255,255,0.07)",
        accent: "#6C5CE7",
        "accent-light": "#A29BFE",
        "accent-glow": "rgba(108,92,231,0.25)",
        primary: "#F0EFFF",
        secondary: "#7B7A9A",
        muted: "#3D3C5C",
        success: "#00CEC9",
        warning: "#FDCB6E",
        danger: "#E17055",
      },
      boxShadow: {
        glow: "0 0 40px rgba(108,92,231,0.18)",
        "glow-sm": "0 0 20px rgba(108,92,231,0.12)",
        card: "0 1px 1px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
