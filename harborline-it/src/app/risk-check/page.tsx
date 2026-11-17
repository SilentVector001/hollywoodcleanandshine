import type { Metadata } from "next";
import { brand, type RiskQuestion } from "@config/brand";
import { Icon } from "@/components/Icon";
import type { QuizQuestion } from "@/lib/risk-check";
import { RiskCheckQuiz } from "./RiskCheckQuiz";

export const metadata: Metadata = {
  title: "Free IT Risk Check",
  description: brand.riskCheck.intro,
  alternates: { canonical: "/risk-check" },
};

export default function RiskCheckPage() {
  const { riskCheck } = brand;
  // Only send what the quiz needs. The "why" and "what to do" guidance stays
  // on the server until the visitor unlocks the full report.
  const questions: QuizQuestion[] = riskCheck.questions.map((q: RiskQuestion) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    help: q.help,
    options: q.options,
  }));

  return (
    <div className="bg-gradient-to-b from-brand-light/80 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:px-8 lg:py-20">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{riskCheck.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-brand-dark sm:text-4xl lg:text-5xl">
            {riskCheck.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{riskCheck.intro}</p>
          <ul className="mt-6 hidden space-y-2.5 sm:block">
            {riskCheck.promoPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-slate-700">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Icon name="clock" className="h-4 w-4" /> {riskCheck.timeEstimate}
            <span aria-hidden>·</span>
            <Icon name="lock" className="h-4 w-4" /> Private
          </p>
        </div>

        <RiskCheckQuiz
          questions={questions}
          bands={riskCheck.bands}
          gate={riskCheck.gate}
          organizationLabel={brand.contact.form.organizationLabel}
          privacyNote={riskCheck.privacyNote}
        />
      </div>
    </div>
  );
}
