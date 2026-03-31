interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function PageHero({ badge, title, subtitle, icon }: PageHeroProps) {
  return (
    <div className="text-center max-w-2xl mx-auto px-4 pt-14 pb-10 animate-fade-up">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
        style={{
          background: "rgba(108,92,231,0.1)",
          border: "1px solid rgba(108,92,231,0.2)",
        }}
      >
        <span style={{ color: "var(--accent-light)" }}>{icon}</span>
        <span
          className="text-xs font-medium tracking-wide"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--accent-light)" }}
        >
          {badge}
        </span>
      </div>
      <h1
        className="font-bold text-3xl md:text-4xl leading-tight mb-4"
        style={{ fontFamily: "Sora, sans-serif", color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      <p
        className="text-base md:text-lg leading-relaxed"
        style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-secondary)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
