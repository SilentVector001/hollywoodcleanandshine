"use server";

import { redirect } from "next/navigation";
import { brand } from "@config/brand";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { upsertLead } from "@/lib/leads";
import { bandFor, scoreAnswers, type AnswerMap } from "@/lib/risk-check";
import { isEmail, isPhone, str, type FieldErrors } from "@/lib/validation";

type Field = "name" | "business" | "email" | "phone";

export type RiskCheckState = {
  status: "idle" | "error";
  message?: string;
  errors?: FieldErrors<Field>;
  values?: Partial<Record<Field, string>>;
};

function parseAnswers(raw: string): AnswerMap {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
  } catch {
    return {};
  }
}

export async function submitRiskCheck(_prev: RiskCheckState, formData: FormData): Promise<RiskCheckState> {
  // Honeypot: bots fill hidden fields; people don't. Quietly do nothing.
  if (str(formData, "website")) return { status: "idle" };

  const values = {
    name: str(formData, "name", 120),
    business: str(formData, "business", 160),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 40),
  };

  const errors: FieldErrors<Field> = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!values.business) errors.business = brand.contact.form.organizationError;
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (!isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  // Never trust a score sent from the browser: recompute it from the answers.
  const result = scoreAnswers(brand.riskCheck.questions, parseAnswers(str(formData, "answers", 5000)));
  if (!result) {
    return {
      status: "error",
      message: "Some answers were missing. Please go back and answer every question.",
      values,
    };
  }
  const band = bandFor(result.score, brand.riskCheck.bands);

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
