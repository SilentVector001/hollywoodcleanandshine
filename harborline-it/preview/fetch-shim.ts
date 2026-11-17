import { brand } from "@config/brand";
import { demoReply } from "@/lib/assistant/demo";
import { isEmail, isPhone } from "@/lib/validation";

/** In the preview there is no server, so the chat's two API calls are answered in the browser. */
export function installFetchShim() {
  const original = window.fetch.bind(window);
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
  const pause = () => new Promise((resolve) => setTimeout(resolve, 500));

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.pathname : input.url;
    if (url !== "/api/chat" && url !== "/api/chat/book") return original(input, init);

    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, string>;
    await pause();

    if (url === "/api/chat") {
      return json({ sessionId: "preview", mode: "demo", ...demoReply(String(body.message ?? "")) });
    }

    const errors: Record<string, string> = {};
    if (!body.name?.trim()) errors.name = "Please add your name.";
    if (!body.business?.trim()) errors.business = brand.contact.form.organizationError;
    if (!isEmail(body.email ?? "")) errors.email = "Please enter a valid email.";
    if (!isPhone(body.phone ?? "")) errors.phone = "Please enter a valid phone number.";
    if (Object.keys(errors).length > 0) return json({ errors }, 400);

    const firstName = body.name.trim().split(/\s+/)[0];
    return json({ ok: true, sessionId: "preview", confirmation: brand.assistant.bookingConfirmation.replace("{name}", firstName) });
  };
}
