"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-ink shadow-xs placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 aria-[invalid=true]:border-red-500";

export function ContactForm({
  practiceTypes,
  teamSizes,
  plans,
  defaultPlan = "",
  successMessage,
  labels,
}: {
  practiceTypes: string[];
  teamSizes: string[];
  plans: string[];
  defaultPlan?: string;
  successMessage: string;
  labels: {
    organizationLabel: string;
    organizationTypeLabel: string;
    teamSizeLabel: string;
    planLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    privacyNote: string;
  };
}) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-brand-light p-8 text-center ring-1 ring-brand/20">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-4 text-lg font-semibold text-brand-dark">{successMessage}</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.errors ?? {};
  const plan = v.plan ?? (plans.includes(defaultPlan) ? defaultPlan : "");

  return (
    <form action={formAction} noValidate className="grid gap-5 sm:grid-cols-2">
      {state.status === "error" && state.message ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
          {state.message}
        </p>
      ) : null}

      <Field label="Your name" name="name" error={err.name}>
        <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={inputClass} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
      </Field>

      <Field label={labels.organizationLabel} name="practice" error={err.practice}>
        <input id="practice" name="practice" autoComplete="organization" required defaultValue={v.practice} className={inputClass} aria-invalid={!!err.practice} aria-describedby={err.practice ? "practice-error" : undefined} />
      </Field>

      <Field label="Email" name="email" error={err.email}>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputClass} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
      </Field>

      <Field label="Phone" name="phone" optional error={err.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} aria-invalid={!!err.phone} aria-describedby={err.phone ? "phone-error" : undefined} />
      </Field>

      <Field label={labels.organizationTypeLabel} name="practiceType" optional>
        <select id="practiceType" name="practiceType" defaultValue={v.practiceType ?? ""} className={inputClass}>
          <option value="">Choose one</option>
          {practiceTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label={labels.teamSizeLabel} name="teamSize" optional>
        <select id="teamSize" name="teamSize" defaultValue={v.teamSize ?? ""} className={inputClass}>
          <option value="">Choose one</option>
          {teamSizes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label={labels.planLabel} name="plan" optional className="sm:col-span-2">
        <select id="plan" name="plan" defaultValue={plan} className={inputClass}>
          <option value="">Not sure yet</option>
          {plans.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field label={labels.messageLabel} name="message" error={err.message} className="sm:col-span-2">
        <textarea id="message" name="message" rows={5} required defaultValue={v.message} className={inputClass} placeholder={labels.messagePlaceholder} aria-invalid={!!err.message} aria-describedby={err.message ? "message-error" : undefined} />
      </Field>

      {/* Honeypot field for bots. Hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
        <p className="mt-3 text-xs text-muted">{labels.privacyNote}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  optional,
  error,
  className = "",
  children,
}: {
  label: string;
  name: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-800">
        {label} {optional ? <span className="font-normal text-slate-500">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
