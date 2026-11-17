"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { RiskBand } from "@config/brand";
import { Field, Honeypot, inputClass } from "@/components/ui/form";
import { ScoreRing } from "@/components/risk-check/ScoreRing";
import {
  bandFor,
  itemStatus,
  scoreAnswers,
  type AnswerMap,
  type QuizQuestion,
} from "@/lib/risk-check";
import { submitRiskCheck, type RiskCheckState } from "./actions";

const initialState: RiskCheckState = { status: "idle" };

interface GateCopy {
  title: string;
  intro: string;
  submitLabel: string;
  consentNote: string;
}

export function RiskCheckQuiz({
  questions,
  bands,
  gate,
  organizationLabel,
  privacyNote,
}: {
  questions: QuizQuestion[];
  bands: RiskBand[];
  gate: GateCopy;
  organizationLabel: string;
  privacyNote: string;
}) {
  const total = questions.length;
  const [step, setStep] = useState(0); // 0..total-1 = questions, total = lead form
  const [answers, setAnswers] = useState<AnswerMap>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);
  const hasMoved = useRef(false);

  // After moving between steps, bring the card into view and move focus to
  // the new heading so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (!hasMoved.current) return;
    const card = cardRef.current;
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  function goTo(next: number) {
    window.clearTimeout(advanceTimer.current);
    hasMoved.current = true;
    setStep(Math.max(0, Math.min(total, next)));
  }

  function choose(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // Short pause so the selection is visible before moving on.
    const next = step + 1;
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goTo(next), 260);
  }

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const progress = Math.round((Math.min(step, total) / total) * 100);

  return (
    <div ref={cardRef} className="scroll-mt-24 rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
      <div className="border-b border-slate-100 px-6 pt-5 pb-4 sm:px-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted">
            {step < total ? `Question ${step + 1} of ${total}` : "Your results"}
          </span>
          {step < total ? (
            <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
              {questions[step].category}
            </span>
          ) : null}
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label="Risk Check progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {step < total ? (
          <QuestionStep
            key={questions[step].id}
            question={questions[step]}
            selected={answers[questions[step].id]}
            headingRef={headingRef}
            onChoose={choose}
            onBack={step > 0 ? () => goTo(step - 1) : undefined}
            onNext={answers[questions[step].id] ? () => goTo(step + 1) : undefined}
          />
        ) : answeredCount === total ? (
          <GateStep
            questions={questions}
            answers={answers}
            bands={bands}
            gate={gate}
            organizationLabel={organizationLabel}
            privacyNote={privacyNote}
            headingRef={headingRef}
            onBack={() => goTo(total - 1)}
          />
        ) : (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-brand-dark outline-none">
              A few questions still need answers
            </h2>
            <button type="button" onClick={() => goTo(questions.findIndex((q) => !answers[q.id]))} className="mt-4 font-semibold text-brand underline">
              Go to the first unanswered question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  question,
  selected,
  headingRef,
  onChoose,
  onBack,
  onNext,
}: {
  question: QuizQuestion;
  selected?: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onChoose: (questionId: string, optionId: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} id={`q-${question.id}`} className="text-xl font-bold text-balance text-brand-dark outline-none sm:text-2xl">
        {question.question}
      </h2>
      {question.help ? <p className="mt-2 text-sm text-muted">{question.help}</p> : null}

      <ul className="mt-6 grid gap-3" aria-labelledby={`q-${question.id}`}>
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <li key={option.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChoose(question.id, option.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isSelected
                    ? "border-brand bg-brand-light font-semibold text-brand-dark"
                    : "border-slate-200 text-slate-800 hover:border-brand/50 hover:bg-brand-light/40"
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-brand bg-brand" : "border-slate-300"
                  }`}
                >
                  {isSelected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        {onBack ? (
          <button type="button" onClick={onBack} className="rounded-md px-2 py-1 text-sm font-semibold text-muted hover:text-brand-dark">
            ← Back
          </button>
        ) : (
          <span />
        )}
        {onNext ? (
          <button type="button" onClick={onNext} className="rounded-md px-2 py-1 text-sm font-semibold text-brand hover:text-brand-dark">
            Next →
          </button>
        ) : null}
      </div>
    </div>
  );
}

function GateStep({
  questions,
  answers,
  bands,
  gate,
  organizationLabel,
  privacyNote,
  headingRef,
  onBack,
}: {
  questions: QuizQuestion[];
  answers: AnswerMap;
  bands: RiskBand[];
  gate: GateCopy;
  organizationLabel: string;
  privacyNote: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitRiskCheck, initialState);
  const scored = scoreAnswers(questions, answers);
  if (!scored) return null;

  const band = bandFor(scored.score, bands);
  const atRisk = scored.items.filter((i) => itemStatus(i) === "risk").length;
  const needsAttention = scored.items.filter((i) => itemStatus(i) === "attention").length;
  const v = state.values ?? {};
  const err = state.errors ?? {};

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <ScoreRing score={scored.score} tone={band.tone} size={128} />
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-brand-dark outline-none">
            {gate.title}: <span className="whitespace-nowrap">{band.label}</span>
          </h2>
          <p className="mt-2 text-muted">
            {atRisk + needsAttention === 0
              ? "No major gaps found. Your full report shows what's working and how to keep it that way."
              : `We found ${atRisk + needsAttention} area${atRisk + needsAttention === 1 ? "" : "s"} to improve${
                  atRisk ? `, including ${atRisk} at risk` : ""
                }.`}
          </p>
        </div>
      </div>

      {/* Locked preview of the full report */}
      <div aria-hidden className="relative mt-6 overflow-hidden rounded-xl border border-slate-200 p-4">
        <div className="space-y-3 blur-[3px] select-none">
          {["Top priority", "Second priority", "Third priority"].map((t) => (
            <div key={t} className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-brand-dark">{t}</span>
              <span className="h-2 w-2/5 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/40">
          <span className="rounded-full bg-brand-dark px-3 py-1 text-xs font-semibold text-white">Full report locked</span>
        </div>
      </div>

      <p className="mt-6 text-muted">{gate.intro}</p>

      <form action={formAction} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        {state.status === "error" && state.message ? (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
            {state.message}
          </p>
        ) : null}

        <input type="hidden" name="answers" value={JSON.stringify(answers)} />

        <Field label="Your name" name="name" error={err.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={inputClass} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
        </Field>
        <Field label={organizationLabel} name="business" error={err.business}>
          <input id="business" name="business" autoComplete="organization" required defaultValue={v.business} className={inputClass} aria-invalid={!!err.business} aria-describedby={err.business ? "business-error" : undefined} />
        </Field>
        <Field label="Work email" name="email" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputClass} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
        </Field>
        <Field label="Phone" name="phone" error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required defaultValue={v.phone} className={inputClass} aria-invalid={!!err.phone} aria-describedby={err.phone ? "phone-error" : undefined} />
        </Field>

        <Honeypot />

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Preparing your report…" : gate.submitLabel}
          </button>
          <p className="mt-3 text-xs text-muted">{gate.consentNote}</p>
          <p className="mt-1 text-xs text-muted">{privacyNote}</p>
          <button type="button" onClick={onBack} className="mt-4 text-sm font-semibold text-muted hover:text-brand-dark">
            ← Change my answers
          </button>
        </div>
      </form>
    </div>
  );
}
