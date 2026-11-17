import { brand, type FaqItem, type PricingTier, type Service } from "@config/brand";

/**
 * Turns config/brand.ts into a plain-text fact sheet. This is the ONLY
 * knowledge the AI assistant is allowed to use. Output is deterministic
 * (no dates or random values) so the prompt can be cached.
 */
export function buildKnowledge(): string {
  const { company, niche, services, whyUs, process, pricing, faq, riskCheck, about, assistant } = brand;
  const lines: string[] = [];
  const section = (title: string) => lines.push("", `## ${title}`);

  section("Company");
  lines.push(
    `Name: ${company.name}`,
    `What we do: ${company.shortDescription}`,
    `Who we serve: ${niche.label} (${niche.audience})`,
    `Based in: ${company.city}, ${company.state} (${company.region})`,
    `On-site service area: ${company.serviceArea.join(", ")}`,
    `Phone: ${company.phone.display}`,
    `Email: ${company.email}`,
    `Office hours: ${company.hours}`,
    `Emergency coverage: ${company.emergencyNote}`,
    `In business since: ${company.foundedYear}`,
    `Mission: ${about.mission}`,
  );

  section("Services");
  for (const s of services.items as Service[]) {
    lines.push(`- ${s.title}: ${s.description} Includes: ${s.bullets.join("; ")}.`);
  }

  section("Why clients choose us");
  for (const w of whyUs.items) lines.push(`- ${w.title}: ${w.description}`);

  section("How getting started works");
  process.steps.forEach((step, i) => lines.push(`${i + 1}. ${step.title}: ${step.description}`));

  section("Plans and pricing");
  lines.push(pricing.intro);
  for (const t of pricing.tiers as PricingTier[]) {
    const price = pricing.showPrices ? `${t.price} ${t.unit}` : "custom quote";
    lines.push(`- ${t.name} (${price}): ${t.description} Includes: ${t.features.join("; ")}.`);
  }
  lines.push(`Pricing note: ${pricing.note}`);

  section("Frequently asked questions");
  for (const f of faq.items as FaqItem[]) lines.push(`Q: ${f.question}`, `A: ${f.answer}`);

  section("Free IT Risk Check");
  lines.push(
    `${riskCheck.intro} It takes ${riskCheck.timeEstimate.toLowerCase()} at ${company.siteUrl.replace(/\/$/, "")}/risk-check.`,
    `Topics covered: ${riskCheck.promoPoints.join("; ")}.`,
    riskCheck.report.disclaimer,
  );

  section("Booking a call");
  lines.push(
    "Visitors can book a free 15-minute call. In this chat, a short booking form collects name, business, email, phone and a preferred time. The team replies within one business day.",
    `Visitors can also call ${company.phone.display} or use the contact page.`,
  );

  if (assistant.extraFacts.length > 0) {
    section("Other facts");
    for (const fact of assistant.extraFacts) lines.push(`- ${fact}`);
  }

  section("Legal");
  lines.push(brand.legal.hipaaDisclaimer);

  return lines.join("\n").trim();
}
