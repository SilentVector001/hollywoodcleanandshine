/**
 * ============================================================================
 *  BRAND CONFIG — the one file you edit to launch a new client.
 * ============================================================================
 *
 *  Everything brand-specific on the site (copy, colors, pricing, FAQ, tone of
 *  voice) comes from this file. Components never hard-code client details.
 *
 *  Cloning checklist (see README for the full walkthrough):
 *    1. company      → name, phone, email, city, service area, mailing address
 *    2. demo         → set enabled: false for a real client
 *    3. colors/logo  → brand colors + wordmark
 *    4. hero, problems, services, whyUs, process → niche-specific copy
 *    5. pricing      → real tiers, or set showPrices: false
 *    6. testimonials → real, permissioned quotes only (or leave empty)
 *    7. faq, tone    → also used by the AI assistant, so keep them accurate
 *
 *  Harborline IT is a FICTIONAL company. All names, numbers and quotes below
 *  are invented for demonstration purposes.
 * ============================================================================
 */

/** Icons available to the site. Rendered by src/components/Icon.tsx. */
export type IconName =
  | "shield"
  | "lock"
  | "cloud"
  | "server"
  | "users"
  | "alert"
  | "storm"
  | "laptop"
  | "clock"
  | "chart"
  | "mail"
  | "stethoscope"
  | "wifi"
  | "check"
  | "phone"
  | "map"
  | "spark"
  | "headset";

export interface Link {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface Service extends Feature {
  bullets: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: Link;
}

export interface Testimonial {
  quote: string;
  role: string;
  organization: string;
  /** Must be true unless you have a real, permissioned quote. Shows a "Sample" label. */
  sample: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface RiskOption {
  /** Stable id stored with each saved answer. Don't rename once live. */
  id: string;
  label: string;
  /** Points earned for this answer. The best answer earns the question's full weight. */
  points: number;
}

export interface RiskQuestion {
  /** Stable id stored with each saved answer. Don't rename once live. */
  id: string;
  /** Short label shown in reports, e.g. "Backups". */
  category: string;
  question: string;
  help?: string;
  /** Plain-English "why this matters", shown in the full report. */
  why: string;
  /** What good looks like / the next step, shown in the full report. */
  recommendation: string;
  options: RiskOption[];
}

export interface RiskBand {
  /** Lowest score (0–100) that falls in this band. */
  min: number;
  label: string;
  tone: "good" | "fair" | "warn" | "risk";
  summary: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const brand = {
  // ---------------------------------------------------------------- company
  company: {
    name: "Harborline IT",
    legalName: "Harborline IT",
    tagline: "Calm, secure IT for South Florida medical and dental offices.",
    shortDescription:
      "Managed IT, cybersecurity and HIPAA-ready support for small medical and dental practices from Palm Beach to Miami.",
    city: "Fort Lauderdale",
    region: "South Florida",
    state: "FL",
    serviceArea: ["Miami-Dade County", "Broward County", "Palm Beach County"],
    // 555-01xx numbers are reserved for fiction. Replace for a real client.
    phone: { display: "(954) 555-0142", href: "tel:+19545550142" },
    email: "hello@harborline-it.example",
    hours: "Mon–Fri, 7:30am–6:00pm ET",
    emergencyNote: "24/7 emergency line included on Pro and Complete plans.",
    // CAN-SPAM requires a valid physical mailing address in marketing email.
    mailingAddress: "[Mailing address placeholder], Fort Lauderdale, FL 33301",
    foundedYear: 2016,
    /** Used for dates on reports and emails. */
    timeZone: "America/New_York",
    siteUrl,
  },

  // ------------------------------------------------------------------- niche
  niche: {
    label: "medical & dental offices",
    singular: "practice",
    plural: "practices",
    audience: "practice owners and office managers",
  },

  // -------------------------------------------------------------------- demo
  /** Shows a thin banner on every page. Set enabled: false for real clients. */
  demo: {
    enabled: true,
    bannerText:
      "Demo site: Harborline IT is a fictional company. Names, prices and testimonials are samples.",
  },

  // ------------------------------------------------------------------ colors
  /** Hex values. Applied as CSS variables, used by Tailwind classes like bg-brand. */
  colors: {
    primary: "#0F6E7A", // buttons, links, highlights (white text must be readable on it)
    primaryDark: "#0B3142", // headings, dark sections, footer
    primaryLight: "#E7F3F2", // soft section backgrounds
    accent: "#F4A259", // secondary CTA, badges (dark text sits on it)
  },

  // -------------------------------------------------------------------- logo
  logo: {
    /** Wordmark is rendered as text: `text` in dark, `suffix` in primary color. */
    text: "Harborline",
    suffix: "IT",
    /** Single character shown in the square logo mark and favicon. */
    mark: "H",
  },

  // --------------------------------------------------------------------- seo
  seo: {
    title: "Harborline IT | Managed IT for Medical & Dental Offices in South Florida",
    description:
      "Managed IT, cybersecurity, backups and HIPAA security support for small medical and dental practices in Miami-Dade, Broward and Palm Beach.",
    keywords: [
      "managed IT services",
      "dental office IT support",
      "medical office IT support",
      "HIPAA IT",
      "South Florida MSP",
    ],
  },

  // -------------------------------------------------------------- navigation
  nav: [
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies Link[],

  /** "Talk to us" call to action, used on pricing, About, Contact and the closing band. */
  primaryCta: { label: "Book a free 15-minute call", href: "/contact" } satisfies Link,

  /** Button in the site header (desktop and mobile). Points at the lead magnet. */
  headerCta: { label: "Free IT Risk Check", href: "/risk-check" } satisfies Link,

  // -------------------------------------------------------------------- hero
  hero: {
    eyebrow: "Managed IT for South Florida medical & dental offices",
    headline: "Your practice runs on technology. We keep it running.",
    subheadline:
      "Harborline IT looks after your computers, network, backups and HIPAA security safeguards, so your team can focus on patients instead of passwords.",
    primaryCta: { label: "Take the free IT Risk Check", href: "/risk-check" } satisfies Link,
    secondaryCta: { label: "Book a free 15-minute call", href: "/contact" } satisfies Link,
    highlights: [
      "We sign your BAA",
      "Local techs in Broward, Palm Beach & Miami-Dade",
      "Flat monthly pricing",
    ],
    /** The illustrative "dashboard" card beside the headline. */
    snapshot: {
      title: "Practice health snapshot",
      caption: "Example report",
      items: [
        { label: "Backups", status: "Verified last night" },
        { label: "Multi-factor login", status: "14 of 14 staff" },
        { label: "Security updates", status: "Up to date" },
        { label: "Phishing training", status: "Completed this quarter" },
        { label: "Hurricane plan", status: "Reviewed for this season" },
      ],
    },
  },

  // ---------------------------------------------------------------- problems
  problems: {
    eyebrow: "Sound familiar?",
    title: "The IT headaches we fix for practices every week",
    intro:
      "Small medical and dental offices depend on technology all day, but rarely have anyone whose job is to look after it.",
    items: [
      {
        title: "The schedule stops when the network does",
        description:
          "A down server or flaky Wi-Fi means no charts, no imaging and no check-ins, with a waiting room full of patients.",
        icon: "alert",
      },
      {
        title: "HIPAA questions you can't answer",
        description:
          "Where is patient data stored? Who can access it? Is it encrypted? If someone asked tomorrow, would you know?",
        icon: "shield",
      },
      {
        title: "Ransomware targets offices like yours",
        description:
          "Patient records are valuable to criminals, and small offices often have thin defenses. One bad click can lock everything.",
        icon: "lock",
      },
      {
        title: "Hurricane season makes everyone nervous",
        description:
          "Power outages and flooding shouldn't mean lost records or a week of closed doors.",
        icon: "storm",
      },
      {
        title: "Slow computers in every operatory",
        description:
          "Aging workstations and skipped updates slow down every exam room, every appointment, every day.",
        icon: "laptop",
      },
      {
        title: "“IT” is whoever is free that day",
        description:
          "Your office manager shouldn't be the help desk, and the break-fix guy takes days to call back.",
        icon: "users",
      },
    ] satisfies Feature[],
  },

  // ---------------------------------------------------------------- services
  services: {
    eyebrow: "What we do",
    title: "Everything your practice needs from IT, in one monthly plan",
    intro: "One team, one number to call, and one predictable bill.",
    items: [
      {
        title: "Managed IT & help desk",
        description: "Friendly, unlimited support for your whole team, plus monitoring that catches problems early.",
        icon: "headset",
        bullets: [
          "Unlimited remote help desk",
          "24/7 monitoring and alerts",
          "Workstation and server care",
          "We call your software vendors for you",
        ],
      },
      {
        title: "Cybersecurity",
        description: "Layered protection that stops the most common attacks on small healthcare offices.",
        icon: "lock",
        bullets: [
          "Endpoint protection on every device",
          "Multi-factor login for staff",
          "Email filtering and phishing defense",
          "Security awareness training",
        ],
      },
      {
        title: "Backup & disaster recovery",
        description: "Encrypted backups we actually test, so a bad day doesn't become a lost week.",
        icon: "cloud",
        bullets: [
          "Encrypted onsite and cloud backups",
          "Monthly restore tests",
          "Written hurricane-season plan",
          "Documented recovery steps",
        ],
      },
      {
        title: "HIPAA security support",
        description: "The technical safeguards and documentation behind your HIPAA Security Rule obligations.",
        icon: "shield",
        bullets: [
          "Annual Security Risk Assessment support",
          "Policy and procedure templates",
          "Access reviews and audit logs",
          "Business Associate Agreement (BAA)",
        ],
      },
      {
        title: "Network & Wi-Fi",
        description: "Fast, secure connections for exam rooms, front desk and patients.",
        icon: "wifi",
        bullets: [
          "Business-grade firewall",
          "Separate guest Wi-Fi for patients",
          "Secure remote access for providers",
          "Internet failover options",
        ],
      },
      {
        title: "Cloud email & files",
        description: "Professional email and file sharing that's encrypted and easy to use.",
        icon: "mail",
        bullets: [
          "Business email setup and migration",
          "Encrypted email for patient info",
          "Secure cloud file sharing",
          "Account setup when staff join or leave",
        ],
      },
    ] satisfies Service[],
  },

  // ------------------------------------------------------------------ why us
  whyUs: {
    eyebrow: "Why Harborline",
    title: "Built for small healthcare offices, not everyone",
    intro:
      "We only work with medical and dental practices, so we already know your workflows, your software and your obligations.",
    items: [
      {
        title: "Healthcare is all we do",
        description: "From imaging PCs to front-desk check-in, we know how a practice day actually works.",
        icon: "stethoscope",
      },
      {
        title: "Local and responsive",
        description:
          "South Florida technicians, with a 15-minute response target for urgent issues during business hours.",
        icon: "clock",
      },
      {
        title: "Flat, predictable pricing",
        description: "One monthly price per user. No surprise invoices for every password reset.",
        icon: "chart",
      },
      {
        title: "Plain-English reports",
        description: "A short monthly summary of what we did, what's at risk and what we recommend.",
        icon: "mail",
      },
      {
        title: "Security is standard",
        description: "Multi-factor login, encryption and tested backups come with every plan, not as upsells.",
        icon: "shield",
      },
      {
        title: "Hurricane-ready",
        description: "Every client gets a written weather plan: what's backed up, how you stay reachable, how we restore.",
        icon: "storm",
      },
    ] satisfies Feature[],
  },

  // ----------------------------------------------------------------- process
  process: {
    eyebrow: "How it works",
    title: "From first call to fully managed in about 30 days",
    steps: [
      {
        title: "Free 15-minute call",
        description: "Tell us what's frustrating you. We'll tell you honestly whether we can help.",
      },
      {
        title: "On-site assessment",
        description: "We review your network, devices, backups and security, then share a plain-English findings report.",
      },
      {
        title: "Fixed quote",
        description: "One clear monthly price based on your users, devices and locations.",
      },
      {
        title: "Onboarding",
        description: "We fix urgent risks first, document everything and introduce your team to the help desk.",
      },
    ],
  },

  // -------------------------------------------------------------- testimonials
  /**
   * IMPORTANT: only use real quotes with written permission. Anything invented
   * must keep `sample: true`, which displays a visible "Sample" label.
   */
  testimonials: {
    eyebrow: "What practices say",
    title: "Less time on IT, more time with patients",
    items: [
      {
        quote:
          "Our front desk used to lose an hour a week to computer problems. Now we make one call and it's handled.",
        role: "Office Manager",
        organization: "Family dental practice, Broward County",
        sample: true,
      },
      {
        quote:
          "For the first time, when someone asks about our HIPAA safeguards, we have a clear answer and the paperwork to back it up.",
        role: "Practice Owner",
        organization: "Pediatric clinic, Palm Beach County",
        sample: true,
      },
      {
        quote:
          "When a storm knocked out our power, our records were safe and we were seeing patients again the next morning.",
        role: "Practice Administrator",
        organization: "Multi-provider medical office, Miami-Dade County",
        sample: true,
      },
    ] satisfies Testimonial[],
  },

  // ----------------------------------------------------------------- pricing
  pricing: {
    eyebrow: "Plans & pricing",
    title: "Simple per-user pricing",
    intro: "Every plan includes unlimited help desk support, monitoring, security updates and a signed BAA.",
    /** Set false to hide dollar amounts and show "Contact us for a quote" instead. */
    showPrices: true,
    note: "Sample pricing for this demo. Final pricing depends on your number of users, devices and locations.",
    tiers: [
      {
        name: "Essentials",
        price: "$99",
        unit: "per user / month",
        description: "Reliable support and the security basics for small offices.",
        features: [
          "Unlimited remote help desk (business hours)",
          "24/7 monitoring and security updates",
          "Endpoint protection on every device",
          "Daily encrypted cloud backup",
          "Signed Business Associate Agreement",
          "Monthly plain-English report",
        ],
        cta: { label: "Book a call", href: "/contact?plan=Essentials" },
      },
      {
        name: "Pro",
        price: "$149",
        unit: "per user / month",
        description: "The safeguards most practices need for HIPAA, fully managed.",
        features: [
          "Everything in Essentials",
          "Multi-factor login rollout and management",
          "Phishing training and simulations",
          "Onsite + cloud backup with monthly restore tests",
          "Annual Security Risk Assessment support",
          "24/7 emergency line",
        ],
        highlighted: true,
        badge: "Most popular",
        cta: { label: "Book a call", href: "/contact?plan=Pro" },
      },
      {
        name: "Complete",
        price: "$199",
        unit: "per user / month",
        description: "Fully managed IT for multi-provider and multi-location practices.",
        features: [
          "Everything in Pro",
          "Scheduled on-site visits",
          "24/7 security monitoring and response",
          "Network, Wi-Fi and firewall management",
          "Hurricane plan with internet failover",
          "Quarterly planning reviews",
        ],
        cta: { label: "Book a call", href: "/contact?plan=Complete" },
      },
    ] satisfies PricingTier[],
  },

  // --------------------------------------------------------------------- faq
  /** Also the knowledge base for the AI assistant. Keep answers accurate. */
  faq: {
    eyebrow: "FAQ",
    title: "Questions practices ask us",
    items: [
      {
        question: "Do you sign a Business Associate Agreement (BAA)?",
        answer:
          "Yes. Because we may come into contact with protected health information while supporting your systems, we sign a BAA with every client before any work begins.",
      },
      {
        question: "Will you make our practice HIPAA compliant?",
        answer:
          "No IT company can make a practice compliant on its own. HIPAA also covers your policies, training and how your team handles patient information. We put the technical safeguards in place, document them, and support your annual Security Risk Assessment. We don't provide legal advice.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Plans start at $99 per user per month (sample pricing for this demo). Your exact price depends on users, devices and locations, and we give you a fixed quote after a free assessment.",
      },
      {
        question: "Do we have to sign a long-term contract?",
        answer:
          "No. After a 90-day onboarding period, plans are month-to-month with 30 days' notice to cancel.",
      },
      {
        question: "How fast do you respond?",
        answer:
          "Our target is 15 minutes for urgent issues during business hours and same day for routine requests. Pro and Complete plans include a 24/7 emergency line.",
      },
      {
        question: "Can you work with our practice software and imaging systems?",
        answer:
          "Very likely. We work directly with your software vendors on installs, updates and troubleshooting, so your staff doesn't have to sit on hold.",
      },
      {
        question: "What happens to our data in a hurricane?",
        answer:
          "Your data is backed up offsite every night, so it's safe even if your office isn't. Before each season we review your weather plan together: how phones forward, how staff can work remotely, and the order we restore systems when power returns.",
      },
      {
        question: "We already have an IT person. Can you still help?",
        answer:
          "Yes. Many practices use us alongside an in-house or part-time IT person, adding security tools, monitoring and after-hours coverage.",
      },
      {
        question: "What is the free IT Risk Check?",
        answer:
          "It's a 10-question self-assessment covering backups, passwords, updates, training and HIPAA basics. It takes about 3 minutes and gives you a score out of 100 with plain-English priorities. It's educational, not a formal HIPAA Security Risk Assessment.",
      },
      {
        question: "Which areas do you serve?",
        answer:
          "Miami-Dade, Broward and Palm Beach counties for on-site work, and remote support anywhere in Florida.",
      },
    ] satisfies FaqItem[],
  },

  // ------------------------------------------------------------ risk check
  /**
   * The "IT Risk Check" lead magnet (/risk-check). Rewrite the questions for
   * each client's niche. Score = points earned ÷ points possible × 100, so the
   * weights can be anything; here they add up to 100 for readability.
   */
  riskCheck: {
    eyebrow: "Free IT Risk Check",
    title: "How exposed is your practice? Find out in 3 minutes.",
    intro:
      "Answer 10 quick questions about backups, passwords, updates and HIPAA basics. You'll get a score out of 100 and a plain-English report with your top priorities.",
    promoTitle: "Not sure where your practice stands?",
    promoText:
      "Take our free 3-minute IT Risk Check. Ten multiple-choice questions, no technical knowledge needed, and a plain-English score out of 100.",
    promoPoints: [
      "Backups and disaster readiness",
      "Passwords and multi-factor login",
      "Security updates and old computers",
      "Staff training and HIPAA basics",
    ],
    ctaLabel: "Start my free Risk Check",
    timeEstimate: "About 3 minutes",
    privacyNote: "Your answers stay private. We never sell or share your information.",
    gate: {
      title: "Your score is ready",
      intro:
        "Enter your details to unlock your full report: your top priorities, why each one matters, and what to do next.",
      submitLabel: "Show my full report",
      consentNote:
        "We'll follow up by email with tips based on your answers. Unsubscribe anytime.",
    },
    report: {
      ctaTitle: "Want help closing these gaps?",
      ctaText:
        "Book a free 15-minute call and we'll walk through your results together. No pressure, no jargon.",
      disclaimer:
        "This self-assessment is for educational purposes only. It is not a formal HIPAA Security Risk Assessment and is not legal advice.",
    },
    /** Checked from the top down; the first band whose `min` the score reaches wins. */
    bands: [
      {
        min: 80,
        label: "Well protected",
        tone: "good",
        summary:
          "Your practice has strong foundations. A few tune-ups will keep it that way as your team and technology change.",
      },
      {
        min: 60,
        label: "A few gaps",
        tone: "fair",
        summary:
          "You have many of the basics in place, but there are gaps that a bad day, a storm or one wrong click could expose.",
      },
      {
        min: 40,
        label: "At risk",
        tone: "warn",
        summary:
          "Several important protections are missing or unproven. They're worth addressing in the next month or two.",
      },
      {
        min: 0,
        label: "High risk",
        tone: "risk",
        summary:
          "Some core protections aren't in place yet. The good news: most of these are quick, affordable fixes once someone owns them.",
      },
    ] satisfies RiskBand[],
    questions: [
      {
        id: "backups",
        category: "Backups",
        question: "How is your practice and patient data backed up?",
        why: "Backups are your safety net against ransomware, failed hardware and storms. Without a recent copy stored somewhere else, one bad day can erase patient records.",
        recommendation:
          "Back up automatically every day to two places: a local device for fast restores and an encrypted cloud copy that ransomware and storms can't reach.",
        options: [
          { id: "two-places", label: "Automatically every day, to an onsite device and the cloud", points: 14 },
          { id: "one-place", label: "Automatically, but to only one place", points: 8 },
          { id: "manual", label: "Someone copies files manually, when they remember", points: 3 },
          { id: "none", label: "We don't, or I'm not sure", points: 0 },
        ],
      },
      {
        id: "restore-test",
        category: "Backup testing",
        question: "When did you last test restoring files from a backup?",
        help: "A test means actually getting files back, not just seeing that a backup ran.",
        why: "Many offices find out their backups don't work only when they need them. A backup you've never restored is a guess.",
        recommendation:
          "Test a restore at least every quarter and keep a short note of what was restored and how long it took.",
        options: [
          { id: "quarter", label: "Within the last 3 months", points: 8 },
          { id: "year", label: "Within the last year", points: 5 },
          { id: "never", label: "Never, as far as I know", points: 0 },
          { id: "unsure", label: "I'm not sure", points: 0 },
        ],
      },
      {
        id: "mfa",
        category: "Multi-factor login",
        question: "Do staff use multi-factor login for email and remote access?",
        help: "Multi-factor login means a code or app prompt on top of the password.",
        why: "Stolen passwords are the most common way into small-business email. Multi-factor login blocks most of these attempts, even when a password leaks.",
        recommendation:
          "Turn on multi-factor login for email, remote access and cloud practice software, for every staff member.",
        options: [
          { id: "everyone", label: "Yes, for everyone", points: 14 },
          { id: "some", label: "For some people or some systems", points: 6 },
          { id: "no", label: "No", points: 0 },
          { id: "unsure", label: "I'm not sure", points: 0 },
        ],
      },
      {
        id: "passwords",
        category: "Passwords & logins",
        question: "How are logins and passwords handled in your office?",
        why: "Shared logins make it impossible to know who opened which patient record, and reused passwords let one breach spread to many accounts.",
        recommendation:
          "Give every person their own login and use a business password manager so strong, unique passwords are easy.",
        options: [
          { id: "manager", label: "Everyone has their own login, managed with a password manager", points: 8 },
          { id: "own-reused", label: "Everyone has their own login, but passwords are reused or written down", points: 4 },
          { id: "some-shared", label: "A few logins are shared between staff", points: 2 },
          { id: "shared", label: "Shared logins are common (for example, one front-desk password)", points: 0 },
        ],
      },
      {
        id: "patching",
        category: "Security updates",
        question: "How do security updates get installed on your computers?",
        why: "Most successful attacks use weaknesses that already had a fix available. Updates that quietly fail leave the door open.",
        recommendation:
          "Automate security updates and have someone confirm every month that each device actually installed them.",
        options: [
          { id: "auto-checked", label: "Automatically, and someone checks they worked", points: 10 },
          { id: "auto", label: "Automatically, but nobody checks", points: 6 },
          { id: "manual", label: "When someone gets around to it", points: 2 },
          { id: "unsure", label: "I'm not sure", points: 0 },
        ],
      },
      {
        id: "outdated",
        category: "Outdated computers",
        question: "Are any computers running an operating system that no longer gets security updates?",
        help: "This often includes an older PC kept around for imaging or a specialty device.",
        why: "Computers that no longer get security updates can't be fixed when new weaknesses appear, and they put the rest of your network at risk.",
        recommendation:
          "Replace unsupported computers. If specialty equipment needs one, keep it off the internet and on its own separate network.",
        options: [
          { id: "none", label: "No, every computer is supported", points: 8 },
          { id: "one-two", label: "One or two", points: 3 },
          { id: "several", label: "Several", points: 0 },
          { id: "unsure", label: "I'm not sure", points: 0 },
        ],
      },
      {
        id: "training",
        category: "Phishing training",
        question: "How often does your team get security or phishing training?",
        why: "Most breaches start with a convincing email. Your team is your first line of defense, and short, regular training makes a real difference.",
        recommendation:
          "Provide short training at least once a year and run practice phishing emails so staff can learn safely.",
        options: [
          { id: "regular", label: "At least yearly, with practice phishing tests", points: 10 },
          { id: "occasional", label: "Once when hired, or occasionally", points: 4 },
          { id: "never", label: "Never", points: 0 },
        ],
      },
      {
        id: "sra",
        category: "HIPAA risk assessment",
        question: "When did your practice last complete a HIPAA Security Risk Assessment?",
        why: "HIPAA requires a regular Security Risk Assessment. It's also one of the first documents requested after a breach or complaint.",
        recommendation:
          "Complete and document a Security Risk Assessment every year, and whenever your systems change significantly.",
        options: [
          { id: "recent", label: "Within the last 12 months, and it's documented", points: 10 },
          { id: "older", label: "1 to 3 years ago", points: 5 },
          { id: "never", label: "More than 3 years ago, or never", points: 0 },
          { id: "unsure", label: "I'm not sure", points: 0 },
        ],
      },
      {
        id: "devices",
        category: "Device protection",
        question: "Are your laptops and workstations encrypted and protected by monitored security software?",
        why: "A lost or stolen laptop with unencrypted patient data can become a reportable breach. Encryption plus monitored security software is a much safer position.",
        recommendation:
          "Encrypt every laptop and workstation, and use security software that's centrally monitored so problems get noticed quickly.",
        options: [
          { id: "full", label: "Yes, encrypted and centrally monitored", points: 10 },
          { id: "partial", label: "We have antivirus, but it isn't monitored or devices aren't encrypted", points: 5 },
          { id: "none", label: "No, or I'm not sure", points: 0 },
        ],
      },
      {
        id: "disaster-plan",
        category: "Hurricane & outage plan",
        question:
          "If your office lost power or flooded for a week, do you have a written plan to keep serving patients?",
        why: "Hurricanes, floods and long outages happen in South Florida. A written plan turns a stressful week into a checklist.",
        recommendation:
          "Write a one-page plan: how phones forward, how staff work remotely and the order systems come back. Review it before each hurricane season.",
        options: [
          { id: "written", label: "Yes, it's written down and we've reviewed it recently", points: 8 },
          { id: "informal", label: "We have a rough idea, but nothing written", points: 3 },
          { id: "no", label: "No", points: 0 },
        ],
      },
    ] satisfies RiskQuestion[],
  },

  // ----------------------------------------------------------------- cta band
  closingCta: {
    title: "Ready for IT you don't have to think about?",
    subtitle: "Book a free 15-minute call. No pressure, no jargon, just an honest look at where you stand.",
  },

  // ------------------------------------------------------------------- about
  about: {
    eyebrow: "About us",
    title: "Local IT people who understand healthcare",
    intro:
      "Harborline IT was started by technicians who spent years fixing the same problems in South Florida medical and dental offices, and wanted to prevent them instead.",
    story: [
      "Most small practices don't have an IT department. They have an office manager who knows where the router is, and a phone number for someone who might call back next week.",
      "We built Harborline to be the IT department those practices never had: proactive, security-minded, and fluent in the realities of patient care, from imaging software to hurricane season.",
      "We keep our client list focused on healthcare so we can go deep instead of wide. That means faster fixes, fewer surprises and advice that actually fits a practice.",
    ],
    mission:
      "Keep South Florida's small medical and dental offices secure, running and ready, so they can focus on their patients.",
    values: [
      { title: "Plain English", description: "If we can't explain it simply, we haven't done our job." },
      { title: "Prevention first", description: "The best support ticket is the one that never needed to be opened." },
      { title: "Respect for patient trust", description: "We treat your patients' information as carefully as you do." },
      { title: "Show up", description: "Local people, real phone calls and follow-through." },
    ],
    /** Invented placeholder team. Replace with real people (with permission). */
    teamLabel: "Sample team",
    team: [
      {
        name: "Jordan Alvarez",
        role: "Founder & Lead Engineer",
        initials: "JA",
        bio: "Fifteen years supporting healthcare offices. Has strong opinions about backups.",
      },
      {
        name: "Priya Castellanos",
        role: "Security & Compliance Lead",
        initials: "PC",
        bio: "Turns HIPAA safeguards into checklists your team can actually follow.",
      },
      {
        name: "Marcus Bell",
        role: "Client Success Manager",
        initials: "MB",
        bio: "Your first call for anything. Remembers everyone's name at the front desk.",
      },
    ] satisfies TeamMember[],
  },

  // ----------------------------------------------------------------- contact
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your practice",
    intro:
      "Tell us a little about your office and what's bothering you. We'll reply within one business day to set up a free 15-minute call.",
    successMessage: "Thanks! We got your message and will reply within one business day.",
    formTitle: "Book a free 15-minute call",
    formSubtitle: "Takes about a minute. We'll reply within one business day.",
    /** Labels for the contact form, so the wording fits each client's niche. */
    form: {
      organizationLabel: "Practice name",
      organizationError: "Please add your practice name.",
      organizationTypeLabel: "Practice type",
      teamSizeLabel: "Team size",
      planLabel: "Plan you're interested in",
      messageLabel: "What's going on with your IT?",
      messagePlaceholder:
        "For example: our Wi-Fi drops during the day and we're not sure our backups work.",
      privacyNote: "Please don't include patient information in this form.",
    },
    /** Options for the "practice type" select on the contact form. */
    practiceTypes: ["Dental", "Medical (primary care)", "Medical (specialty)", "Other healthcare", "Other"],
    /** Options for the "team size" select on the contact form. */
    teamSizes: ["1–5 staff", "6–15 staff", "16–30 staff", "31+ staff"],
  },

  // -------------------------------------------------------------------- tone
  /** Used by the AI assistant and email drafts (Phases 3–4) and as a writing guide for site copy. */
  tone: {
    voice:
      "Calm, reassuring and plain-English, like a trusted neighbor who happens to be great at IT. Warm but professional.",
    do: [
      "Use short sentences and everyday words",
      "Connect IT topics to patients, the schedule and peace of mind",
      "Explain any acronym the first time you use it",
      "Be honest when something needs a conversation with a person",
    ],
    dont: [
      "Use fear tactics or scary statistics",
      "Promise compliance, guaranteed uptime, or prices not listed in this config",
      "Give legal advice",
      "Use heavy technical jargon",
    ],
  },

  // ------------------------------------------------------------------ legal
  legal: {
    hipaaDisclaimer:
      "Harborline IT provides technical safeguards and documentation support. We do not provide legal advice; consult a qualified professional about your HIPAA obligations.",
  },
};

export type Brand = typeof brand;
