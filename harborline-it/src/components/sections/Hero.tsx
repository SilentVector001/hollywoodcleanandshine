import { brand } from "@config/brand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/Icon";

export function Hero() {
  const { hero } = brand;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light via-white to-white">
      {/* soft decorative shapes (placeholder art, no stock images) */}
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm ring-1 ring-brand/15 sm:text-sm">
            <Icon name="stethoscope" className="h-4 w-4" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance text-brand-dark sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-pretty text-muted sm:text-xl">{hero.subheadline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-col gap-2 text-sm font-medium text-slate-700 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {hero.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <SnapshotCard />
      </div>
    </section>
  );
}

function SnapshotCard() {
  const { snapshot } = brand.hero;
  return (
    <figure className="relative mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-brand-dark">{snapshot.title}</p>
          <span className="rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
            {snapshot.caption}
          </span>
        </div>
        <ul className="mt-5 divide-y divide-slate-100">
          {snapshot.items.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-brand">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-brand-light/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-brand-dark">Overall</span>
            <span className="font-bold text-brand">All clear</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white">
            <div className="h-2 w-[92%] rounded-full bg-brand" />
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Illustrative example of a monthly practice IT health report.</figcaption>
    </figure>
  );
}
