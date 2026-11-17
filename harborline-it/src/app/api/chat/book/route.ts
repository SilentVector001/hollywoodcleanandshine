import { brand } from "@config/brand";
import { db } from "@/lib/db";
import { upsertLead } from "@/lib/leads";
import { isAiEnabled } from "@/lib/assistant/claude";
import { CHAT_LIMITS, clientIp, hashIp, oneHourAgo } from "@/lib/assistant/guard";
import { isEmail, isPhone } from "@/lib/validation";

type Field = "name" | "business" | "email" | "phone";

/** "Book a free call" form inside the chat widget. */
export async function POST(request: Request) {
  const { assistant, contact } = brand;
  if (!assistant.enabled) return Response.json({ error: "Chat is disabled" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const text = (key: string, max: number) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "");

  if (text("website", 200)) return Response.json({ ok: true, confirmation: "" }); // honeypot

  const values = {
    name: text("name", 120),
    business: text("business", 160),
    email: text("email", 200),
    phone: text("phone", 40),
  };
  const preferredTime = text("preferredTime", 60);

  const errors: Partial<Record<Field, string>> = {};
  if (!values.name) errors.name = "Please add your name.";
  if (!values.business) errors.business = contact.form.organizationError;
  if (!isEmail(values.email)) errors.email = "Please enter a valid email.";
  if (!isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

  const ipHash = hashIp(clientIp(request));
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  let session = sessionId ? await db.chatSession.findUnique({ where: { id: sessionId } }) : null;
  if (!session) {
    const recent = await db.chatSession.count({ where: { ipHash, createdAt: { gte: oneHourAgo() } } });
    if (recent >= CHAT_LIMITS.maxSessionsPerIpPerHour) {
      return Response.json({ error: `Please call us at ${brand.company.phone.display}.` }, { status: 429 });
    }
    session = await db.chatSession.create({
      data: { mode: isAiEnabled() ? "ai" : "demo", ipHash, startPath: text("startPath", 200) || null },
    });
  }

  try {
    const { lead } = await upsertLead({ ...values, source: "chat" });
    const firstName = values.name.split(/\s+/)[0];
    const confirmation = assistant.bookingConfirmation.replace("{name}", firstName);
    await db.$transaction([
      db.contactRequest.create({
        data: {
          leadId: lead.id,
          channel: "chat",
          message: "Requested a free 15-minute call from the website chat.",
          preferredTime: preferredTime || null,
        },
      }),
      db.chatSession.update({ where: { id: session.id }, data: { leadId: lead.id } }),
      db.chatMessage.create({
        data: {
          sessionId: session.id,
          role: "event",
          content: `Booked a call: ${values.name}, ${values.business}, ${values.email}, ${values.phone}${preferredTime ? `, prefers ${preferredTime}` : ""}`,
        },
      }),
      db.chatMessage.create({ data: { sessionId: session.id, role: "assistant", content: confirmation } }),
    ]);
    return Response.json({ ok: true, sessionId: session.id, leadId: lead.id, confirmation });
  } catch (error) {
    console.error("[chat/book] could not save booking", error);
    return Response.json(
      { error: `Sorry, something went wrong. Please call us at ${brand.company.phone.display}.` },
      { status: 500 },
    );
  }
}
