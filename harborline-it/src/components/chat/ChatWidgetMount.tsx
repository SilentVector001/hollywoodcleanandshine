import { brand } from "@config/brand";
import { isAiEnabled } from "@/lib/assistant/claude";
import { ChatWidget } from "./ChatWidget";

/** Server wrapper: passes only the copy the widget needs, plus which mode is active. */
export function ChatWidgetMount() {
  const { assistant, company } = brand;
  if (!assistant.enabled) return null;
  return (
    <ChatWidget
      name={assistant.name}
      subtitle={assistant.subtitle}
      launcherLabel={assistant.launcherLabel}
      greeting={assistant.greeting}
      suggestions={assistant.suggestions}
      disclaimer={assistant.disclaimer}
      bookingPrompt={assistant.bookingPrompt}
      organizationLabel={brand.contact.form.organizationLabel}
      phone={company.phone}
      initialMode={isAiEnabled() ? "ai" : "demo"}
    />
  );
}
