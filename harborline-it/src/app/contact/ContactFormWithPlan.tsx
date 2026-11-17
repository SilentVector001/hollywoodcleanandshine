"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";

/** Reads ?plan= from the URL so pricing-card buttons preselect a plan. */
export function ContactFormWithPlan(props: Omit<React.ComponentProps<typeof ContactForm>, "defaultPlan">) {
  const plan = useSearchParams().get("plan") ?? "";
  return <ContactForm {...props} defaultPlan={plan} />;
}
