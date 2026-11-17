"use server";

import { brand } from "@config/brand";
import { db } from "@/lib/db";
import { isBot, parseContactForm, type ContactField, type ContactValues } from "@/lib/forms";
import { upsertLead } from "@/lib/leads";
import type { FieldErrors } from "@/lib/validation";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors<ContactField>;
  values?: Partial<ContactValues>;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field.
  if (isBot(formData)) return { status: "success" };

  const form = parseContactForm(formData);
  if (!form.ok) return { status: "error", message: form.message, errors: form.errors, values: form.values };
  const { values } = form;

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
