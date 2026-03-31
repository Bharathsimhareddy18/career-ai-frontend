"use client";

interface ScoreRingProps {
  score: number; // 0–100
  size?: number;
}

export default function ScoreRing({ score, size = 140 }: ScoreRingProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = () => {
    if (score >= 75) return "#00CEC9";
    if (score >= 50) return "#FDCB6E";
    return "#E17055";
  };

  const getLabel = () => {
    if (score >= 75) return "Strong Match";
    if (score >= 50) return "Moderate Match";
    return "Low Match";
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-25"
          style={{ background: color }}
        />
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10 -rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={8}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-sora font-bold text-3xl"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs text-secondary font-dm">/ 100</span>
        </div>
      </div>
      <span
        className="badge border font-medium text-xs px-3 py-1"
        style={{
          color,
          borderColor: `${color}30`,
          background: `${color}12`,
        }}
      >
        {getLabel()}
      </span>
    </div>
  );
}
