import Anthropic from "@anthropic-ai/sdk";
import { brand } from "@config/brand";
import { db } from "@/lib/db";
import { AssistantRefusal, claudeReply, isAiEnabled } from "@/lib/assistant/claude";
import { demoReply } from "@/lib/assistant/demo";
import { CHAT_LIMITS, clientIp, hashIp, oneHourAgo } from "@/lib/assistant/guard";
import { emptyContact, type AssistantReply, type ChatTurn } from "@/lib/assistant/types";

/** Reply that still answers the visitor when we must refuse the request. */
function politeError(status: number, reply: string) {
  return Response.json({ error: true, reply, offerBooking: true, contact: emptyContact }, { status });
}

/** Alternate user/assistant turns, starting with the visitor (the API requires it). */
function toHistory(rows: { role: string; content: string }[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const row of rows) {
    if (row.role !== "user" && row.role !== "assistant") continue;
    const last = turns[turns.length - 1];
    if (last && last.role === row.role) last.content += `\n\n${row.content}`;
    else turns.push({ role: row.role, content: row.content });
  }
  while (turns[0]?.role === "assistant") turns.shift();
  return turns;
}

export async function POST(request: Request) {
  const { assistant, company } = brand;
  if (!assistant.enabled) return Response.json({ error: "Chat is disabled" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return Response.json({ error: "Message is required" }, { status: 400 });
  if (message.length > CHAT_LIMITS.maxMessageLength) {
    return politeError(400, `That message is a bit long for me. Could you shorten it to under ${CHAT_LIMITS.maxMessageLength} characters?`);
  }

  const mode = isAiEnabled() ? "ai" : "demo";
  const ipHash = hashIp(clientIp(request));
  const since = oneHourAgo();
  const limitReply = `I've hit my limit for now. Please call us at ${company.phone.display} or book a free call below.`;

  const recentIpMessages = await db.chatMessage.count({
    where: { role: "user", createdAt: { gte: since }, session: { ipHash } },
  });
  if (recentIpMessages >= CHAT_LIMITS.maxMessagesPerIpPerHour) return politeError(429, limitReply);

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  let session = sessionId
    ? await db.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : null;

  if (!session) {
    const recentSessions = await db.chatSession.count({ where: { ipHash, createdAt: { gte: since } } });
    if (recentSessions >= CHAT_LIMITS.maxSessionsPerIpPerHour) return politeError(429, limitReply);
    const startPath = typeof body.startPath === "string" ? body.startPath.slice(0, 200) : null;
    session = await db.chatSession.create({
      data: { mode, ipHash, startPath },
      include: { messages: true },
    });
  }

  const userMessages = session.messages.filter((m) => m.role === "user").length;
  if (userMessages >= CHAT_LIMITS.maxUserMessagesPerSession) return politeError(429, limitReply);

  // If this visitor already became a lead (e.g. took the Risk Check), link the transcript.
  if (!session.leadId && typeof body.leadRef === "string") {
    const lead = await db.lead.findUnique({ where: { id: body.leadRef }, select: { id: true } });
    if (lead) await db.chatSession.update({ where: { id: session.id }, data: { leadId: lead.id } });
  }

  await db.chatMessage.create({ data: { sessionId: session.id, role: "user", content: message } });

  let result: AssistantReply;
  if (mode === "ai") {
    const history = toHistory([
      ...session.messages.slice(-CHAT_LIMITS.historyMessages),
      { role: "user", content: message },
    ]);
    try {
      result = await claudeReply(history);
    } catch (error) {
      if (error instanceof AssistantRefusal) {
        result = { reply: assistant.fallbackAnswer, offerBooking: true, contact: emptyContact };
      } else {
        if (error instanceof Anthropic.AuthenticationError) console.error("[chat] Anthropic API key was rejected");
        else if (error instanceof Anthropic.RateLimitError) console.error("[chat] Anthropic rate limit reached");
        else if (error instanceof Anthropic.APIError) console.error(`[chat] Anthropic API error ${error.status}`, error.message);
        else console.error("[chat] assistant failed", error);
        result = {
          reply: assistant.errorAnswer.replace("{phone}", company.phone.display),
          offerBooking: true,
          contact: emptyContact,
        };
      }
    }
  } else {
    result = demoReply(message);
  }

  await db.chatMessage.create({ data: { sessionId: session.id, role: "assistant", content: result.reply } });
  if (session.mode !== mode) await db.chatSession.update({ where: { id: session.id }, data: { mode } });

  return Response.json({ sessionId: session.id, mode, ...result });
}
