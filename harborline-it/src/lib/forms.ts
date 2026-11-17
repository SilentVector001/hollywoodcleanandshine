import { brand } from "@config/brand";
import { bandFor, scoreAnswers, type AnswerMap } from "@/lib/risk-check";
import { isEmail, isPhone, str, type FieldErrors } from "@/lib/validation";

/**
 * Form checking shared by the server actions and the static preview build,
 * so both accept and reject exactly the same input.
 */

export function isBot(formData: FormData): boolean {
  return Boolean(str(formData, "website")); // honeypot field
}

// ---------------------------------------------------------------- Risk Check

export type RiskCheckField = "name" | "business" | "email" | "phone";
export type RiskCheckValues = Record<RiskCheckField, string>;

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

export function parseRiskCheckForm(formData: FormData) {
  const values: RiskCheckValues = {
    name: str(formData, "name", 120),
    business: str(formData, "business", 160),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 40),
  };

  const errors: FieldErrors<RiskCheckField> = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!values.business) errors.business = brand.contact.form.organizationError;
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (!isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (Object.keys(errors).length > 0) {
    return { ok: false as const, values, errors, message: "Please fix the highlighted fields." };
  }

  // Never trust a score sent from the browser: recompute it from the answers.
  const result = scoreAnswers(brand.riskCheck.questions, parseAnswers(str(formData, "answers", 5000)));
  if (!result) {
    return {
      ok: false as const,
      values,
      errors,
      message: "Some answers were missing. Please go back and answer every question.",
    };
  }
  return { ok: true as const, values, result, band: bandFor(result.score, brand.riskCheck.bands) };
}

// ------------------------------------------------------------------- Contact

export type ContactField = "name" | "practice" | "email" | "phone" | "message";
export type ContactValues = Record<ContactField | "practiceType" | "teamSize" | "plan", string>;

export function parseContactForm(formData: FormData) {
  const values: ContactValues = {
    name: str(formData, "name", 120),
    practice: str(formData, "practice", 160),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 40),
    practiceType: str(formData, "practiceType", 60),
    teamSize: str(formData, "teamSize", 40),
    plan: str(formData, "plan", 40),
    message: str(formData, "message", 4000),
  };

  const errors: FieldErrors<ContactField> = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!values.practice) errors.practice = brand.contact.form.organizationError;
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (values.phone && !isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (values.message.length < 5) errors.message = "A sentence or two helps us prepare for the call.";

  if (Object.keys(errors).length > 0) {
    return { ok: false as const, values, errors, message: "Please fix the highlighted fields." };
  }
  return { ok: true as const, values };
}
