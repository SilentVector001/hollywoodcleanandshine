import type { RiskCheckState } from "@/app/risk-check/actions";
import { isBot, parseRiskCheckForm } from "@/lib/forms";
import { previewStore } from "../store";

export type { RiskCheckState };

/** Preview version of the Risk Check submit: same checks, but keeps the result in memory. */
export async function submitRiskCheck(_prev: RiskCheckState, formData: FormData): Promise<RiskCheckState> {
  if (isBot(formData)) return { status: "idle" };
  const form = parseRiskCheckForm(formData);
  if (!form.ok) return { status: "error", message: form.message, errors: form.errors, values: form.values };

  previewStore.report = {
    name: form.values.name,
    business: form.values.business,
    score: form.result.score,
    bandLabel: form.band.label,
    items: form.result.items,
    createdAt: new Date(),
  };
  await new Promise((resolve) => setTimeout(resolve, 400));
  window.location.hash = "report";
  return { status: "idle" };
}
