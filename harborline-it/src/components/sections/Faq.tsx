import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";

/** Accordion built on native <details> so it works without JavaScript. */
export function Faq() {
  const { faq } = brand;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <Section id="faq" tone="light">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
        {faq.items.map((item) => (
          <details key={item.question} className="group px-6 py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-brand-dark">
              {item.question}
              <svg
                viewBox="0 0 24 24"
                className="faq-chevron h-5 w-5 shrink-0 text-brand transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </Section>
  );
}
