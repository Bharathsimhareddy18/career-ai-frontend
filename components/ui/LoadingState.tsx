import { Loader2 } from "lucide-react";

export default function LoadingState({ message = "Analysing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 animate-fade-in">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-light)" }} />
        </div>
        <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: "rgba(108,92,231,0.08)" }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-primary)" }}>{message}</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>This may take a few seconds</p>
      </div>
      <div className="w-full max-w-sm space-y-2 mt-2">
        {[80, 60, 72].map((w, i) => (
          <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%`, animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
    </div>
  );
}
