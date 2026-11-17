import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { brand, type RiskQuestion } from "@config/brand";
import { db } from "@/lib/db";
import { Icon } from "@/components/Icon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ScoreRing } from "@/components/risk-check/ScoreRing";
import { StatusChip } from "@/components/risk-check/StatusChip";
import { bandFor, itemStatus, parseStoredItems, topPriorities } from "@/lib/risk-check";
import { PrintButton } from "./PrintButton";
import { RememberLead } from "./RememberLead";

export const metadata: Metadata = {
  title: "Your IT Risk Report",
  // Reports contain personal details: keep them out of search engines.
  robots: { index: false, follow: false },
};

export default function ReportPage({ params }: PageProps<"/risk-check/report/[id]">) {
  return (
    <div className="bg-gradient-to-b from-brand-light/70 to-white print:bg-none">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Suspense fallback={<ReportSkeleton />}>
          <Report params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function Report({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assessment = await db.riskAssessment.findUnique({ where: { id }, include: { lead: true } });
  if (!assessment) notFound();

  const { riskCheck, company } = brand;
  const items = parseStoredItems(assessment.answers);
  const band = riskCheck.bands.find((b) => b.label === assessment.band) ?? bandFor(assessment.score, riskCheck.bands);
  const priorities = topPriorities(items, 3);
  const priorityIds = new Set(priorities.map((p) => p.questionId));
  const guidance = new Map(riskCheck.questions.map((q: RiskQuestion) => [q.id, q]));
  const goodCount = items.filter((i) => itemStatus(i) === "good").length;
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: company.timeZone }).format(
    assessment.createdAt,
  );

  return (
    <article>
      <RememberLead id={assessment.leadId} />
      {/* Summary */}
      <header className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8 print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">IT Risk Report</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">
              {assessment.lead.business}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Prepared for {assessment.lead.name} · {date}
            </p>
          </div>
          <PrintButton />
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={assessment.score} tone={band.tone} size={168} />
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-brand-dark">{band.label}</p>
            <p className="mt-2 max-w-xl text-lg text-slate-700">{band.summary}</p>
            <p className="mt-3 text-sm text-muted">
              {goodCount} of {items.length} areas are in good shape.
            </p>
          </div>
        </div>
      </header>

      {/* Priorities */}
      <section className="mt-10" aria-labelledby="priorities">
        <h2 id="priorities" className="text-xl font-bold text-brand-dark sm:text-2xl">
          {priorities.length > 0 ? "Your top priorities" : "No major gaps found"}
        </h2>
        {priorities.length > 0 ? (
          <ol className="mt-5 space-y-4">
            {priorities.map((item, i) => {
              const q = guidance.get(item.questionId);
              return (
                <li key={item.questionId} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 break-inside-avoid">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent font-bold text-brand-dark">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-brand-dark">{item.category}</h3>
                    <StatusChip status={itemStatus(item)} />
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    You said: <span className="font-medium text-slate-800">“{item.answer}”</span>
                  </p>
                  {q ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-brand-dark">Why it matters</p>
                        <p className="mt-1 text-slate-700">{q.why}</p>
                      </div>
                      <div className="rounded-xl bg-brand-light/70 p-4">
                        <p className="text-sm font-semibold text-brand-dark">What to do</p>
                        <p className="mt-1 text-slate-700">{q.recommendation}</p>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-3 text-slate-700">
            Every area scored well. Keep reviewing these habits as your team and technology change.
          </p>
        )}
      </section>

      {/* Full breakdown */}
      <section className="mt-10" aria-labelledby="breakdown">
        <h2 id="breakdown" className="text-xl font-bold text-brand-dark sm:text-2xl">
          Full breakdown
        </h2>
        <ul className="mt-5 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
          {items.map((item) => {
            const status = itemStatus(item);
            const q = guidance.get(item.questionId);
            return (
              <li key={item.questionId} className="p-5 break-inside-avoid sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-brand-dark">{item.category}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">
                      {item.points}/{item.maxPoints} pts
                    </span>
                    <StatusChip status={status} />
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted">{item.question}</p>
                <p className="mt-2 text-sm text-slate-800">
                  <span className="text-muted">Your answer:</span> {item.answer}
                </p>
                {status !== "good" && !priorityIds.has(item.questionId) && q ? (
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-semibold text-brand-dark">What to do:</span> {q.recommendation}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Call to action */}
      <section className="mt-10 rounded-2xl bg-brand-dark p-6 text-white sm:p-8 break-inside-avoid">
        <h2 className="text-xl font-bold sm:text-2xl">{riskCheck.report.ctaTitle}</h2>
        <p className="mt-2 text-white/80">{riskCheck.report.ctaText}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
          <ButtonLink href={brand.primaryCta.href} variant="accent">
            {brand.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={company.phone.href} variant="ghost-light">
            <Icon name="phone" className="h-5 w-5" />
            Call {company.phone.display}
          </ButtonLink>
        </div>
        <p className="mt-4 hidden text-white/80 print:block">
          {company.name} · {company.phone.display} · {company.email}
        </p>
      </section>

      <p className="mt-8 text-xs text-muted">{riskCheck.report.disclaimer}</p>
    </article>
  );
}

function ReportSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Loading your report">
      <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-200" />
      <div className="h-8 w-1/3 rounded bg-slate-200" />
      <div className="h-40 rounded-2xl bg-white ring-1 ring-slate-200" />
    </div>
  );
}
