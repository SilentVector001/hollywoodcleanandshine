import { brand, type PricingTier } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/Icon";

export function Pricing() {
  const { pricing } = brand;
  return (
    <Section id="pricing">
      <SectionHeading eyebrow={pricing.eyebrow} title={pricing.title} intro={pricing.intro} />
      <ul className="mt-12 grid items-start gap-6 lg:grid-cols-3">
        {pricing.tiers.map((tier: PricingTier) => {
          const featured = Boolean(tier.highlighted);
          return (
            <li
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl p-7 ${
                featured
                  ? "bg-brand-dark text-white shadow-xl ring-2 ring-brand lg:-mt-4 lg:pb-11"
                  : "bg-white ring-1 ring-slate-200"
              }`}
            >
              {tier.badge ? (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-dark">
                  {tier.badge}
                </span>
              ) : null}
              <h3 className={`text-xl font-bold ${featured ? "text-white" : "text-brand-dark"}`}>{tier.name}</h3>
              <p className={`mt-2 text-sm ${featured ? "text-white/75" : "text-muted"}`}>{tier.description}</p>

              <p className="mt-6 flex items-baseline gap-2">
                {pricing.showPrices ? (
                  <>
                    <span className={`text-4xl font-extrabold ${featured ? "text-white" : "text-brand-dark"}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${featured ? "text-white/70" : "text-muted"}`}>{tier.unit}</span>
                  </>
                ) : (
                  <span className={`text-2xl font-bold ${featured ? "text-white" : "text-brand-dark"}`}>
                    Custom quote
                  </span>
                )}
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-accent" : "text-brand"}`} />
                    <span className={featured ? "text-white/90" : "text-slate-700"}>{f}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink href={tier.cta.href} variant={featured ? "accent" : "outline"} className="mt-8 w-full">
                {tier.cta.label}
              </ButtonLink>
            </li>
          );
        })}
      </ul>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">{pricing.note}</p>
    </Section>
  );
}
