import { createHash } from "node:crypto";

/**
 * Limits that keep a public chat endpoint (which can cost money per message
 * in AI mode) from being abused. Tune as needed.
 */
export const CHAT_LIMITS = {
  maxMessageLength: 600,
  maxUserMessagesPerSession: 30,
  maxSessionsPerIpPerHour: 10,
  maxMessagesPerIpPerHour: 60,
  /** How many earlier messages are sent to the AI for context. */
  historyMessages: 20,
};

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** We never store raw IP addresses, only a salted hash for rate limiting. */
export function hashIp(ip: string): string {
  const salt = process.env.SESSION_SECRET || "harborline-chat";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function oneHourAgo(): Date {
  return new Date(Date.now() - 60 * 60 * 1000);
}
