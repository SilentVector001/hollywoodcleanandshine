import type { RiskBand, RiskQuestion } from "@config/brand";

/**
 * IT Risk Check scoring. Pure functions with no config import, so the same
 * code runs in the browser (instant score preview) and on the server (the
 * authoritative score that gets saved).
 */

/** The parts of a question needed to score it (and to show it in the quiz). */
export type QuizQuestion = Pick<RiskQuestion, "id" | "category" | "question" | "help" | "options">;

/** questionId → optionId */
export type AnswerMap = Record<string, string>;

export type ItemStatus = "good" | "attention" | "risk";

/** One answered question, as saved in RiskAssessment.answers. */
export interface ScoredItem {
  questionId: string;
  category: string;
  question: string;
  optionId: string;
  answer: string;
  points: number;
  maxPoints: number;
}

export function maxPointsFor(question: Pick<RiskQuestion, "options">): number {
  return Math.max(0, ...question.options.map((o) => o.points));
}

/**
 * Score a full set of answers. Returns null unless every question has a valid
 * answer, so a tampered or partial submission can never be saved.
 */
export function scoreAnswers(
  questions: QuizQuestion[],
  answers: AnswerMap,
): { score: number; items: ScoredItem[] } | null {
  const items: ScoredItem[] = [];
  for (const q of questions) {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (!option) return null;
    items.push({
      questionId: q.id,
      category: q.category,
      question: q.question,
      optionId: option.id,
      answer: option.label,
      points: option.points,
      maxPoints: maxPointsFor(q),
    });
  }
  return { score: scoreItems(items), items };
}

export function scoreItems(items: ScoredItem[]): number {
  const earned = items.reduce((sum, i) => sum + i.points, 0);
  const possible = items.reduce((sum, i) => sum + i.maxPoints, 0);
  return possible === 0 ? 0 : Math.round((earned / possible) * 100);
}

export function bandFor(score: number, bands: RiskBand[]): RiskBand {
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  return sorted.find((b) => score >= b.min) ?? sorted[sorted.length - 1];
}

export function itemStatus(item: Pick<ScoredItem, "points" | "maxPoints">): ItemStatus {
  const ratio = item.maxPoints === 0 ? 1 : item.points / item.maxPoints;
  if (ratio >= 0.8) return "good";
  if (ratio >= 0.4) return "attention";
  return "risk";
}

/** The biggest gaps first: lowest share of points, then the heaviest-weighted topics. */
export function topPriorities(items: ScoredItem[], count = 3): ScoredItem[] {
  return items
    .filter((i) => itemStatus(i) !== "good")
    .sort((a, b) => a.points / a.maxPoints - b.points / b.maxPoints || b.maxPoints - a.maxPoints)
    .slice(0, count);
}

/** Safely read the JSON snapshot stored in the database. */
export function parseStoredItems(value: unknown): ScoredItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is ScoredItem =>
      typeof v === "object" &&
      v !== null &&
      typeof v.questionId === "string" &&
      typeof v.category === "string" &&
      typeof v.answer === "string" &&
      typeof v.points === "number" &&
      typeof v.maxPoints === "number",
  );
}

export const statusLabels: Record<ItemStatus, string> = {
  good: "In good shape",
  attention: "Needs attention",
  risk: "At risk",
};
