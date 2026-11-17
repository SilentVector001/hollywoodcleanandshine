import type { ContactState } from "@/app/contact/actions";
import { isBot, parseContactForm } from "@/lib/forms";

export type { ContactState };

/** Preview version of the contact form submit: same checks, nothing is sent or saved. */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (isBot(formData)) return { status: "success" };
  const form = parseContactForm(formData);
  if (!form.ok) return { status: "error", message: form.message, errors: form.errors, values: form.values };
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { status: "success" };
}
