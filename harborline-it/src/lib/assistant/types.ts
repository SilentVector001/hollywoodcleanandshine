export type ChatRole = "user" | "assistant";

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

/** Contact details the visitor typed into the chat (used to pre-fill the booking form). */
export interface ContactHints {
  name: string;
  business: string;
  email: string;
  phone: string;
}

export interface AssistantReply {
  reply: string;
  offerBooking: boolean;
  contact: ContactHints;
}

export type AssistantMode = "ai" | "demo";

export const emptyContact: ContactHints = { name: "", business: "", email: "", phone: "" };
