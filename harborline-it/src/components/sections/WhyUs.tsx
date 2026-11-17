import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/Icon";

export function WhyUs() {
  const { whyUs } = brand;
  return (
    <Section id="why-us" tone="dark">
      <SectionHeading eyebrow={whyUs.eyebrow} title={whyUs.title} intro={whyUs.intro} inverted />
      <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
              <Icon name={item.icon} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-white/75">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
