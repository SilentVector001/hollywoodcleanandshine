import type { RiskBand } from "@config/brand";

export const toneColors: Record<RiskBand["tone"], string> = {
  good: "#059669", // emerald
  fair: "var(--brand-primary)",
  warn: "#d97706", // amber
  risk: "#e11d48", // rose
};

/** Circular score gauge (0–100). Pure SVG, works in server and client components. */
export function ScoreRing({
  score,
  tone,
  size = 160,
  label = "out of 100",
}: {
  score: number;
  tone: RiskBand["tone"];
  size?: number;
  label?: string;
}) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={toneColors[tone]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold leading-none text-brand-dark" style={{ fontSize: size * 0.28 }}>
          {clamped}
        </span>
        <span className="mt-1 text-xs font-medium text-muted">{label}</span>
      </div>
      <span className="sr-only">
        Score: {clamped} {label}
      </span>
    </div>
  );
}
