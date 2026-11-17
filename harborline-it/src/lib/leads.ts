import { db } from "@/lib/db";

export type LeadSource = "risk_check" | "contact" | "chat";

export interface LeadInput {
  name: string;
  business: string;
  email: string;
  phone?: string;
  source: LeadSource;
  practiceType?: string;
  teamSize?: string;
}

/**
 * Create or update a lead by email address (one lead per person).
 * Returns `isNew` so later phases can trigger follow-up only for new leads.
 */
export async function upsertLead(input: LeadInput) {
  const email = input.email.trim().toLowerCase();
  const existing = await db.lead.findUnique({ where: { email } });

  if (existing) {
    const lead = await db.lead.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        business: input.business,
        // Don't erase details we already have with blanks.
        phone: input.phone || existing.phone,
        practiceType: input.practiceType || existing.practiceType,
        teamSize: input.teamSize || existing.teamSize,
      },
    });
    return { lead, isNew: false };
  }

  const lead = await db.lead.create({
    data: {
      name: input.name,
      business: input.business,
      email,
      phone: input.phone || null,
      source: input.source,
      practiceType: input.practiceType || null,
      teamSize: input.teamSize || null,
    },
  });
  return { lead, isNew: true };
}
