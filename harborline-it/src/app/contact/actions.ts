"use server";

import { brand } from "@config/brand";
import { isEmail, isPhone, str, type FieldErrors } from "@/lib/validation";

type Field = "name" | "practice" | "email" | "phone" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors<Field>;
  values?: Partial<Record<Field | "practiceType" | "teamSize" | "plan", string>>;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field.
  if (str(formData, "website")) return { status: "success" };

  const values = {
    name: str(formData, "name", 120),
    practice: str(formData, "practice", 160),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 40),
    practiceType: str(formData, "practiceType", 60),
    teamSize: str(formData, "teamSize", 40),
    plan: str(formData, "plan", 40),
    message: str(formData, "message", 4000),
  };

  const errors: FieldErrors<Field> = {};
  if (!values.name) errors.name = "Please tell us your name.";
  if (!values.practice) errors.practice = brand.contact.form.organizationError;
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address.";
  if (values.phone && !isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (values.message.length < 5) errors.message = "A sentence or two helps us prepare for the call.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  // Phase 1: no database yet, so the submission is logged on the server.
  // Phase 2 replaces this with a saved Lead record.
  console.info("[contact] new inquiry", { ...values, receivedAt: new Date().toISOString() });

  return { status: "success" };
}
