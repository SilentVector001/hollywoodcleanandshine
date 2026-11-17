import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";

export function Process({ tone = "white" }: { tone?: "white" | "light" }) {
  const { process } = brand;
  return (
    <Section id="how-it-works" tone={tone}>
      <SectionHeading eyebrow={process.eyebrow} title={process.title} />
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent font-bold text-brand-dark">
              {i + 1}
            </span>
            <h3 className="mt-4 font-semibold text-brand-dark">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
