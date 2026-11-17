"use client";

import { useEffect, useRef, useState } from "react";
import { inputClass } from "@/components/ui/form";
import type { AssistantMode, ContactHints } from "@/lib/assistant/types";

const STORAGE_KEY = "hl_chat";
const LEAD_KEY = "hl_lead";

type Role = "user" | "assistant";
interface UiMessage {
  id: number;
  role: Role;
  content: string;
}

export interface ChatWidgetProps {
  name: string;
  subtitle: string;
  launcherLabel: string;
  greeting: string;
  suggestions: string[];
  disclaimer: string;
  bookingPrompt: string;
  organizationLabel: string;
  phone: { display: string; href: string };
  initialMode: AssistantMode;
}

const blankContact: ContactHints = { name: "", business: "", email: "", phone: "" };

export function ChatWidget(props: ChatWidgetProps) {
  const { name, subtitle, launcherLabel, greeting, suggestions, disclaimer, phone, initialMode } = props;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<AssistantMode>(initialMode);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const [prefill, setPrefill] = useState<ContactHints>(blankContact);
  const restored = useRef(false);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the conversation across page loads in this browser tab.
  useEffect(() => {
    if (!restored.current) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, messages, booked }));
  }, [sessionId, messages, booked]);

  // Scroll to the newest message. When the booking form opens, keep the
  // assistant's answer in view (form below it) instead of jumping past it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const bubbles = list.querySelectorAll<HTMLElement>("[data-bubble]");
    const last = bubbles[bubbles.length - 1];
    const top = bookingOpen && !pending && last ? last.offsetTop - 12 : list.scrollHeight;
    list.scrollTo({ top, behavior: "smooth" });
  }, [messages, pending, bookingOpen]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function openChat() {
    if (!restored.current) {
      restored.current = true;
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
        if (saved && Array.isArray(saved.messages)) {
          setMessages(saved.messages);
          setSessionId(saved.sessionId ?? null);
          setBooked(Boolean(saved.booked));
          nextId.current = saved.messages.length + 1;
        }
      } catch {
        /* ignore corrupt storage */
      }
    }
    setOpen(true);
  }

  function push(role: Role, content: string) {
    setMessages((prev) => [...prev, { id: nextId.current++, role, content }]);
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    setDraft("");
    push("user", message);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message,
          startPath: window.location.pathname,
          leadRef: localStorage.getItem(LEAD_KEY) ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.mode) setMode(data.mode);
      push("assistant", data.reply ?? `Sorry, something went wrong. Please call us at ${phone.display}.`);
      if (data.offerBooking && !booked) {
        setBookingOpen(true);
        if (data.contact) {
          setPrefill((prev) => ({
            name: data.contact.name || prev.name,
            business: data.contact.business || prev.business,
            email: data.contact.email || prev.email,
            phone: data.contact.phone || prev.phone,
          }));
        }
      }
    } catch {
      push("assistant", `Sorry, I couldn't connect. Please call us at ${phone.display}.`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="print:hidden">
      {open ? (
        <div
          role="dialog"
          aria-label={`${name} chat`}
          className="fixed inset-x-3 bottom-20 z-50 flex h-[min(36rem,calc(100dvh-6.5rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:inset-x-auto sm:right-6 sm:w-[24rem]"
        >
          <header className="flex items-center justify-between gap-3 bg-brand-dark px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold leading-tight">{name}</p>
                <p className="text-xs text-white/70">{subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
            >
              <span className="sr-only">Close chat</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          {mode === "demo" ? (
            <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
              <strong>Demo mode:</strong> answers are matched from this site&apos;s FAQ, not live AI.
            </p>
          ) : null}

          <div ref={listRef} className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            <Bubble role="assistant">{greeting}</Bubble>
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {pending ? (
              <div className="flex gap-1 px-2 py-1" aria-label="Assistant is typing">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            ) : null}

            {messages.length === 0 && !pending ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-sm text-brand-dark hover:bg-brand-light"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {bookingOpen && !booked ? (
              <BookingCard
                {...props}
                sessionId={sessionId}
                prefill={prefill}
                onCancel={() => setBookingOpen(false)}
                onBooked={(confirmation, newSessionId, leadId) => {
                  setBooked(true);
                  setBookingOpen(false);
                  if (newSessionId) setSessionId(newSessionId);
                  if (leadId) localStorage.setItem(LEAD_KEY, leadId);
                  if (confirmation) push("assistant", confirmation);
                }}
              />
            ) : null}
          </div>

          <div className="border-t border-slate-200 px-3 pt-2 pb-3">
            {!booked && !bookingOpen ? (
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="mb-2 w-full rounded-lg bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand-dark hover:bg-brand/15"
              >
                Book a free 15-minute call
              </button>
            ) : null}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-end gap-2"
            >
              <label htmlFor="chat-input" className="sr-only">
                Type your question
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={600}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
                placeholder="Ask a question…"
                className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              <button
                type="submit"
                disabled={pending || !draft.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-dark disabled:opacity-50"
              >
                <span className="sr-only">Send</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-muted">{disclaimer}</p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-brand px-4 font-semibold text-white shadow-lg ring-4 ring-white/60 transition-colors hover:bg-brand-dark sm:right-6 sm:bottom-6"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <ChatIcon className="h-6 w-6" />
        )}
        <span className={open ? "sr-only" : "hidden sm:inline"}>{open ? "Close chat" : launcherLabel}</span>
        {!open ? <span className="sr-only sm:hidden">{launcherLabel}</span> : null}
      </button>
    </div>
  );
}

function Bubble({ role, children }: { role: Role; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div data-bubble className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-line ${
          mine ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-slate-100 text-slate-800"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function BookingCard({
  bookingPrompt,
  organizationLabel,
  sessionId,
  prefill,
  onCancel,
  onBooked,
}: ChatWidgetProps & {
  sessionId: string | null;
  prefill: ContactHints;
  onCancel: () => void;
  onBooked: (confirmation: string, sessionId?: string, leadId?: string) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/chat/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, sessionId, startPath: window.location.pathname }),
      });
      const data = await res.json();
      if (res.ok) onBooked(data.confirmation, data.sessionId, data.leadId);
      else if (data.errors) setErrors(data.errors);
      else setFormError(data.error ?? "Something went wrong.");
    } catch {
      setFormError("Couldn't connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const small = inputClass.replace("py-2.5", "py-2").replace("mt-1.5", "mt-1");
  const field = (id: string, label: string, type: string, autoComplete: string, value: string) => (
    <div>
      <label htmlFor={`book-${id}`} className="text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={`book-${id}`}
        name={id}
        type={type}
        autoComplete={autoComplete}
        defaultValue={value}
        aria-invalid={!!errors[id]}
        className={small}
      />
      {errors[id] ? <p className="mt-1 text-xs text-red-600">{errors[id]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-2.5 rounded-2xl border border-brand/25 bg-brand-light/50 p-3.5">
      <p className="text-sm font-semibold text-brand-dark">{bookingPrompt}</p>
      {field("name", "Your name", "text", "name", prefill.name)}
      {field("business", organizationLabel, "text", "organization", prefill.business)}
      {field("email", "Email", "email", "email", prefill.email)}
      {field("phone", "Phone", "tel", "tel", prefill.phone)}
      <div>
        <label htmlFor="book-preferredTime" className="text-xs font-medium text-slate-700">
          Best time to call <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <select id="book-preferredTime" name="preferredTime" defaultValue="" className={small}>
          <option value="">Any time</option>
          <option>Morning</option>
          <option>Midday</option>
          <option>Afternoon</option>
        </select>
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {formError ? <p className="text-xs text-red-600">{formError}</p> : null}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Request my call"}
        </button>
        <button type="button" onClick={onCancel} className="px-2 py-2 text-sm text-muted hover:text-brand-dark">
          Not now
        </button>
      </div>
    </form>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.4c-.3.3-.8 0-.8-.4V5.5z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </svg>
  );
}
