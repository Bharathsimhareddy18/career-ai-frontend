import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "Career AI — Your Intelligent Career Companion",
  description: "AI-powered resume analysis, career roadmaps, and DSA preparation to land your dream role.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="mesh-bg" />
          <div className="relative z-10">
            <Navbar />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
