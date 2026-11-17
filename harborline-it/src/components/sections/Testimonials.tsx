import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";

/** Every testimonial with sample: true carries a visible "Sample" label. */
export function Testimonials() {
  const { testimonials } = brand;
  if (testimonials.items.length === 0) return null;
  const anySample = testimonials.items.some((t) => t.sample);

  return (
    <Section id="testimonials" tone="light">
      <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />
      {anySample ? (
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted">
          Sample testimonials for demonstration only. These are not quotes from real clients.
        </p>
      ) : null}
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.items.map((t) => (
          <li key={t.quote} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            {t.sample ? (
              <span className="mb-4 self-start rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-dark">
                Sample
              </span>
            ) : null}
            <blockquote className="flex-1 text-slate-800">
              <p>“{t.quote}”</p>
            </blockquote>
            <p className="mt-6 text-sm">
              <span className="font-semibold text-brand-dark">{t.role}</span>
              <span className="block text-muted">{t.organization}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
