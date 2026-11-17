import { brand } from "@config/brand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/Icon";

/** Home page band promoting the IT Risk Check lead magnet. */
export function RiskCheckPromo() {
  const { riskCheck } = brand;
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-brand p-8 text-white shadow-xl sm:p-12 lg:grid-cols-[1.2fr_1fr]">
        <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent/20" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">{riskCheck.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{riskCheck.promoTitle}</h2>
          <p className="mt-4 text-lg text-white/85">{riskCheck.promoText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/risk-check" variant="accent">
              {riskCheck.ctaLabel}
            </ButtonLink>
            <span className="inline-flex items-center gap-2 text-sm text-white/75">
              <Icon name="clock" className="h-4 w-4" /> {riskCheck.timeEstimate}
            </span>
          </div>
        </div>
        <ul className="relative grid gap-3 rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm">
          <li className="text-sm font-semibold uppercase tracking-wider text-white/70">What we check</li>
          {riskCheck.promoPoints.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-brand-dark">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <span className="text-white/95">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
