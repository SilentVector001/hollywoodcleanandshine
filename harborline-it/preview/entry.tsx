/**
 * Static, browser-only preview of the site (no server, no database).
 * Built by scripts/build-preview.mjs into preview/dist/index.html.
 */
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { brand } from "@config/brand";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import RiskCheckPage from "@/app/risk-check/page";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ReportView } from "@/components/risk-check/ReportView";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { installFetchShim } from "./fetch-shim";
import { PREVIEW_PAGES, previewStore } from "./store";

function currentHash() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function PreviewBar() {
  return (
    <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-brand-dark sm:text-sm">
      Preview copy: the Risk Check and chat work in demo mode, but nothing is saved here. The full site saves leads
      and conversations to its database.
    </div>
  );
}

function PreviewReport() {
  const report = previewStore.report;
  if (!report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-brand-dark">No report yet</h1>
        <p className="mt-4 text-muted">Take the Risk Check to see your report.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/risk-check">{brand.riskCheck.ctaLabel}</ButtonLink>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-b from-brand-light/70 to-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <p className="mb-6 rounded-lg bg-accent/25 px-4 py-3 text-sm text-brand-dark">
          Preview: on the live site this report gets its own private link, and the lead is saved for follow-up.
        </p>
        <ReportView {...report} />
      </div>
    </div>
  );
}

function App() {
  const [hash, setHash] = useState(currentHash);

  useEffect(() => {
    const onChange = () => setHash(currentHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const page = PREVIEW_PAGES.includes(hash) ? hash : "home";

  // Page views start at the top; section names (#pricing, #faq...) scroll to that section.
  useEffect(() => {
    if (hash && !PREVIEW_PAGES.includes(hash)) document.getElementById(hash)?.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [hash]);

  const { assistant, company } = brand;
  return (
    <>
      <PreviewBar />
      <DemoBanner />
      <SiteHeader />
      <main id="main" className="flex-1">
        {page === "about" ? (
          <AboutPage />
        ) : page === "contact" ? (
          <ContactPage />
        ) : page === "risk-check" ? (
          <RiskCheckPage />
        ) : page === "report" ? (
          <PreviewReport />
        ) : (
          <HomePage />
        )}
      </main>
      <SiteFooter />
      {assistant.enabled ? (
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
          initialMode="demo"
        />
      ) : null}
    </>
  );
}

// Same brand-color variables the real layout sets on <html>.
const rootStyle = document.documentElement.style;
rootStyle.setProperty("--brand-primary", brand.colors.primary);
rootStyle.setProperty("--brand-primary-dark", brand.colors.primaryDark);
rootStyle.setProperty("--brand-primary-light", brand.colors.primaryLight);
rootStyle.setProperty("--brand-accent", brand.colors.accent);

installFetchShim();
createRoot(document.getElementById("root")!).render(<App />);
