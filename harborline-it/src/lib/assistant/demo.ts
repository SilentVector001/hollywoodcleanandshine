import { brand, type FaqItem, type PricingTier, type Service } from "@config/brand";
import { emptyContact, type AssistantReply, type ContactHints } from "./types";

/**
 * Free "demo mode" assistant, used when no ANTHROPIC_API_KEY is set.
 *
 * Not AI: it finds the config entry (FAQ, services, pricing, ...) that shares
 * the most keywords with the visitor's message, after mapping common
 * synonyms. Good enough to demo the experience; the live AI understands far
 * more phrasings and follow-up questions.
 */

const STOPWORDS = new Set(
  "a an the and or but if of to in on for with at by from as is are was were be been being do does did i me my we our us you your it its this that these those what which who whom how can could would should will shall may might have has had about any some there here so than too very just also into out up over under again more most other such no not only own same then once can't don't won't i'm we're you're it's".split(
    " ",
  ),
);

/** Different words visitors use for the same idea → one shared token. */
const SYNONYMS: Record<string, string> = {
  cost: "price", costs: "price", pricing: "price", priced: "price", charge: "price", charges: "price",
  fee: "price", fees: "price", much: "price", expensive: "price", cheap: "price", budget: "price",
  rate: "price", rates: "price", afford: "price", quote: "price",
  plans: "plan", tier: "plan", tiers: "plan", package: "plan", packages: "plan",
  contract: "contract", cancel: "contract", commitment: "contract", term: "contract", terms: "contract",
  baa: "baa", associate: "baa", hipaa: "hipaa", compliant: "hipaa", compliance: "hipaa",
  hurricane: "hurricane", hurricanes: "hurricane", storm: "hurricane", storms: "hurricane",
  flood: "hurricane", flooding: "hurricane", power: "hurricane", outage: "hurricane", weather: "hurricane",
  fast: "respond", quick: "respond", quickly: "respond", response: "respond", respond: "respond",
  emergency: "respond", urgent: "respond", wait: "respond",
  backup: "backup", backups: "backup", restore: "backup", recovery: "backup",
  ransomware: "security", hacked: "security", hack: "security", virus: "security", malware: "security",
  phishing: "security", cyber: "security", cybersecurity: "security", secure: "security",
  area: "area", location: "area", located: "area", where: "area", miami: "area", broward: "area",
  palm: "area", dade: "area", serve: "area", florida: "area",
  hours: "hours", open: "hours", available: "hours", weekend: "hours",
  phone: "contact", email: "contact", reach: "contact", number: "contact", address: "contact",
  software: "software", ehr: "software", imaging: "software", vendor: "software", vendors: "software",
  xray: "software", program: "software",
  wifi: "network", internet: "network", firewall: "network", router: "network", network: "network",
  quiz: "riskcheck", assessment: "riskcheck", score: "riskcheck", check: "riskcheck",
  start: "onboard", started: "onboard", onboarding: "onboard", switch: "onboard", switching: "onboard",
  begin: "onboard", process: "onboard", steps: "onboard",
};

function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/wi-fi/g, "wifi")
    .replace(/x-ray/g, "xray")
    .replace(/24\/7/g, "emergency")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/'s$/, ""))
    .filter((w) => w && !STOPWORDS.has(w))
    .map((w) => SYNONYMS[w] ?? stem(w));
}

interface Entry {
  /** Extra keywords (weight 3) */
  keys: string;
  /** Question or title (weight 2) */
  title: string;
  answer: string;
  offerBooking?: boolean;
}

function buildEntries(): Entry[] {
  const { company, services, pricing, process, whyUs, about, faq, assistant } = brand;
  const tiers = pricing.tiers as PricingTier[];
  // FAQ questions are the business's own answers to common questions, so they get the highest weight.
  const entries: Entry[] = (faq.items as FaqItem[]).map((f) => ({ keys: f.question, title: "", answer: f.answer }));

  entries.push(
    {
      keys: "price plan monthly per user tier compare difference",
      title: "plans and pricing",
      answer: pricing.showPrices
        ? `We have ${tiers.length} plans: ${tiers.map((t) => `${t.name} at ${t.price} ${t.unit}`).join(", ")}. ${pricing.intro} ${pricing.note}`
        : `${pricing.intro} Pricing depends on your users, devices and locations, so we give each office a fixed quote.`,
      offerBooking: true,
    },
    {
      keys: "service services list everything",
      title: "what services do you provide",
      answer: `We offer ${(services.items as Service[]).map((s) => s.title).join("; ")}, all in one monthly plan. Which would you like to know more about?`,
    },
    {
      keys: "contact hours call talk speak",
      title: "how can I contact you phone email hours",
      answer: `You can call us at ${company.phone.display} or email ${company.email}. Office hours are ${company.hours}. ${company.emergencyNote}`,
    },
    {
      keys: "onboard how work get first next",
      title: "how does getting started work",
      answer: `Getting started is simple: ${process.steps.map((s, i) => `${i + 1}) ${s.title.toLowerCase()}`).join(", ")}. ${process.title}.`,
      offerBooking: true,
    },
    {
      keys: "why different choose better reason",
      title: "why choose you",
      answer: `${whyUs.intro} Clients also like our ${whyUs.items
        .slice(1, 4)
        .map((w) => w.title.toLowerCase())
        .join(", ")}.`,
    },
    {
      keys: "who about company team founded since mission story local",
      title: "about your company",
      answer: `${about.intro} We've been around since ${company.foundedYear}.`,
    },
    {
      keys: "bot ai human robot real person automated",
      title: "are you a bot",
      answer: `I'm ${assistant.name}, an automated assistant. For anything I can't answer, our team is happy to help on a free 15-minute call.`,
    },
  );

  for (const s of services.items as Service[]) {
    entries.push({
      keys: "",
      title: s.title,
      answer: `${s.title}: ${s.description} Includes: ${s.bullets.join("; ")}.`,
    });
  }

  // One entry per plan, so "what's in Pro?" gets that plan specifically.
  for (const t of tiers) {
    entries.push({
      keys: t.name,
      title: `${t.name} plan`,
      answer: `${t.name}${pricing.showPrices ? ` (${t.price} ${t.unit})` : ""}: ${t.description} Includes: ${t.features.join("; ")}.${
        pricing.showPrices ? ` ${pricing.note}` : ""
      }`,
      offerBooking: true,
    });
  }
  return entries;
}

type IndexedEntry = Entry & { weights: Map<string, number> };
let index: IndexedEntry[] | null = null;

function getIndex(): IndexedEntry[] {
  if (index) return index;
  index = buildEntries().map((entry) => {
    const weights = new Map<string, number>();
    const add = (text: string, w: number) => {
      for (const t of tokenize(text)) weights.set(t, Math.max(weights.get(t) ?? 0, w));
    };
    add(entry.answer, 1);
    add(entry.title, 2);
    add(entry.keys, 3);
    return { ...entry, weights };
  });
  return index;
}

const EMAIL_RE = /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const NAME_RE = /\b(?:[Mm]y name is|I am|I'm|[Tt]his is)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/;

function contactHints(message: string): ContactHints {
  return {
    ...emptyContact,
    email: message.match(EMAIL_RE)?.[0] ?? "",
    phone: message.match(PHONE_RE)?.[0] ?? "",
    name: message.match(NAME_RE)?.[1] ?? "",
  };
}

const BOOKING_RE =
  /\b(book|schedul\w*|appointment|call me|talk to (someone|a person|you)|speak (to|with)|set up a call|sign up|consult\w*|meeting|contact me|reach me|get a quote|get started)\b/i;
const PROBLEM_RE =
  /\b(broken|down|slow|not working|doesn't work|won't (load|connect|start)|crash\w*|drop\w*|hacked|virus|issue|problem|trouble|frozen|freez\w*|stuck)\b/i;

export function demoReply(message: string): AssistantReply {
  const { assistant, company } = brand;
  const text = message.trim();
  const words = text.split(/\s+/).length;
  const contact = contactHints(text);

  if (contact.email || contact.phone) {
    return {
      reply: "Thanks! Please confirm your details in the form below and our team will reach out to schedule your free call.",
      offerBooking: true,
      contact,
    };
  }
  if (words <= 4 && /^(hi|hello|hey|howdy|good (morning|afternoon|evening))\b/i.test(text)) {
    return {
      reply: `Hi! What would you like to know about ${company.name}? I can help with plans, HIPAA support, response times and more.`,
      offerBooking: false,
      contact,
    };
  }
  if (words <= 6 && /\b(thanks|thank you|thx|appreciate it)\b/i.test(text)) {
    return { reply: "You're welcome! Anything else I can help with?", offerBooking: false, contact };
  }
  if (BOOKING_RE.test(text)) {
    return { reply: assistant.bookingPrompt, offerBooking: true, contact };
  }

  const tokens = new Set(tokenize(text));
  let best: IndexedEntry | null = null;
  let bestScore = 0;
  for (const entry of getIndex()) {
    let score = 0;
    for (const t of tokens) score += entry.weights.get(t) ?? 0;
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }

  // Asking about price or describing a live problem are buying signals.
  const describesProblem = PROBLEM_RE.test(text);
  const priceInterest = tokens.has("price");
  if (!best || bestScore < 3) {
    return { reply: assistant.fallbackAnswer, offerBooking: true, contact };
  }
  return {
    reply: best.answer,
    offerBooking: Boolean(best.offerBooking) || describesProblem || priceInterest,
    contact,
  };
}
