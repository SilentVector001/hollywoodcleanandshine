import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/Icon";

export function Services() {
  const { services } = brand;
  return (
    <Section id="services">
      <SectionHeading eyebrow={services.eyebrow} title={services.title} intro={services.intro} />
      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.items.map((s) => (
          <li
            key={s.title}
            className="flex flex-col rounded-2xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
              <Icon name={s.icon} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-brand-dark">{s.title}</h3>
            <p className="mt-2 text-muted">{s.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
