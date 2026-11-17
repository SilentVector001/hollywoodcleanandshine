"use server";

import { brand } from "@config/brand";
import { db } from "@/lib/db";
import { upsertLead } from "@/lib/leads";
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

  try {
    const { lead } = await upsertLead({
      name: values.name,
      business: values.practice,
      email: values.email,
      phone: values.phone,
      practiceType: values.practiceType,
      teamSize: values.teamSize,
      source: "contact",
    });
    await db.contactRequest.create({
      data: { leadId: lead.id, message: values.message, plan: values.plan || null },
    });
  } catch (error) {
    console.error("[contact] could not save inquiry", error);
    return {
      status: "error",
      message: `Sorry, something went wrong sending your message. Please try again or call us at ${brand.company.phone.display}.`,
      values,
    };
  }

  return { status: "success" };
}
