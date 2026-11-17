import { brand } from "@config/brand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/Icon";

export function CtaBand() {
  const { closingCta, company } = brand;
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/20" />
        <h2 className="relative text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
          {closingCta.title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/85">{closingCta.subtitle}</p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={brand.primaryCta.href} variant="accent">
            {brand.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={company.phone.href} variant="ghost-light">
            <Icon name="phone" className="h-5 w-5" />
            Call {company.phone.display}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
