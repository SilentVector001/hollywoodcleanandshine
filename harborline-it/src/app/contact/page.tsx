import type { Metadata } from "next";
import { Suspense } from "react";
import { brand } from "@config/brand";
import { Icon } from "@/components/Icon";
import { ContactForm } from "./ContactForm";
import { ContactFormWithPlan } from "./ContactFormWithPlan";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ${brand.company.name} about managed IT for your ${brand.niche.singular}. ${brand.contact.intro}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact, company } = brand;
  const formProps = {
    practiceTypes: contact.practiceTypes,
    teamSizes: contact.teamSizes,
    plans: brand.pricing.tiers.map((t) => t.name),
    successMessage: contact.successMessage,
    labels: contact.form,
  };

  return (
    <div className="bg-gradient-to-b from-brand-light/70 to-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{contact.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance text-brand-dark sm:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{contact.intro}</p>

          <ul className="mt-10 space-y-6">
            <ContactRow icon="phone" label="Call us">
              <a href={company.phone.href} className="font-semibold text-brand-dark hover:text-brand">
                {company.phone.display}
              </a>
              <span className="block text-sm text-muted">{company.hours}</span>
              <span className="block text-sm text-muted">{company.emergencyNote}</span>
            </ContactRow>
            <ContactRow icon="mail" label="Email">
              <a href={`mailto:${company.email}`} className="break-all font-semibold text-brand-dark hover:text-brand">
                {company.email}
              </a>
            </ContactRow>
            <ContactRow icon="map" label="Service area">
              <span className="text-brand-dark">{company.serviceArea.join(" · ")}</span>
              <span className="block text-sm text-muted">{company.mailingAddress}</span>
            </ContactRow>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-xl font-bold text-brand-dark">{contact.formTitle}</h2>
          <p className="mt-1 mb-6 text-sm text-muted">{contact.formSubtitle}</p>
          {/* The plan picked on the pricing section (?plan=Pro) is read at request time;
              the static fallback is the same form without a preselected plan. */}
          <Suspense fallback={<ContactForm {...formProps} />}>
            <ContactFormWithPlan {...formProps} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: "phone" | "mail" | "map";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
        <Icon name={icon} />
      </span>
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        {children}
      </div>
    </li>
  );
}
