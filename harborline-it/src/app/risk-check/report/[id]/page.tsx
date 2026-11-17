import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { ReportView } from "@/components/risk-check/ReportView";
import { parseStoredItems } from "@/lib/risk-check";
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

  return (
    <>
      <RememberLead id={assessment.leadId} />
      <ReportView
        business={assessment.lead.business}
        name={assessment.lead.name}
        createdAt={assessment.createdAt}
        score={assessment.score}
        bandLabel={assessment.band}
        items={parseStoredItems(assessment.answers)}
        actions={<PrintButton />}
      />
    </>
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
