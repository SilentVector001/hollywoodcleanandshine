"use server";

import { redirect } from "next/navigation";
import { brand } from "@config/brand";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { isBot, parseRiskCheckForm, type RiskCheckField } from "@/lib/forms";
import { upsertLead } from "@/lib/leads";
import type { FieldErrors } from "@/lib/validation";

export type RiskCheckState = {
  status: "idle" | "error";
  message?: string;
  errors?: FieldErrors<RiskCheckField>;
  values?: Partial<Record<RiskCheckField, string>>;
};

export async function submitRiskCheck(_prev: RiskCheckState, formData: FormData): Promise<RiskCheckState> {
  // Honeypot: bots fill hidden fields; people don't. Quietly do nothing.
  if (isBot(formData)) return { status: "idle" };

  const form = parseRiskCheckForm(formData);
  if (!form.ok) return { status: "error", message: form.message, errors: form.errors, values: form.values };
  const { values, result, band } = form;

  let assessmentId: string;
  try {
    const { lead } = await upsertLead({ ...values, source: "risk_check" });
    const assessment = await db.riskAssessment.create({
      data: {
        leadId: lead.id,
        score: result.score,
        band: band.label,
        answers: result.items as unknown as Prisma.InputJsonValue,
      },
    });
    assessmentId = assessment.id;
  } catch (error) {
    console.error("[risk-check] could not save submission", error);
    return {
      status: "error",
      message: `Sorry, something went wrong saving your results. Please try again or call us at ${brand.company.phone.display}.`,
      values,
    };
  }

  redirect(`/risk-check/report/${assessmentId}`);
}
