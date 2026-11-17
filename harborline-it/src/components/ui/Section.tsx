/** Consistent section wrapper + heading so every page shares the same rhythm. */
export function Section({
  id,
  className = "",
  children,
  tone = "white",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "white" | "light" | "dark";
}) {
  const toneClass =
    tone === "dark" ? "bg-brand-dark text-white" : tone === "light" ? "bg-brand-light/60" : "bg-white";
  return (
    <section id={id} className={`${toneClass} py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={`text-sm font-semibold uppercase tracking-wider ${inverted ? "text-accent" : "text-brand"}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl ${inverted ? "text-white" : "text-brand-dark"}`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-4 text-lg text-pretty ${inverted ? "text-white/80" : "text-muted"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
