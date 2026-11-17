import type { ScoredItem } from "@/lib/risk-check";

/** In-memory state for the static preview (nothing is saved anywhere). */
export interface PreviewReport {
  name: string;
  business: string;
  score: number;
  bandLabel: string;
  items: ScoredItem[];
  createdAt: Date;
}

export const previewStore: { plan: string; report: PreviewReport | null } = { plan: "", report: null };

export const PREVIEW_PAGES = ["home", "about", "contact", "risk-check", "report"];
