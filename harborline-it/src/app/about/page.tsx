import type { Metadata } from "next";
import { brand } from "@config/brand";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/Icon";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description: brand.about.intro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { about, company } = brand;
  return (
    <>
      <section className="bg-gradient-to-b from-brand-light to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">{about.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance text-brand-dark sm:text-5xl">
            {about.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted sm:text-xl">{about.intro}</p>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg text-slate-700">
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside className="self-start rounded-2xl bg-brand-dark p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Our mission</p>
            <p className="mt-3 text-xl font-semibold leading-snug">{about.mission}</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 text-sm">
              <div>
                <dt className="text-white/60">Based in</dt>
                <dd className="mt-1 font-semibold">
                  {company.city}, {company.state}
                </dd>
              </div>
              <div>
                <dt className="text-white/60">Since</dt>
                <dd className="mt-1 font-semibold">{company.foundedYear}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-white/60">Serving</dt>
                <dd className="mt-1 font-semibold">{company.serviceArea.join(", ")}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading eyebrow="What we believe" title="Our values" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v) => (
            <li key={v.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <Icon name="spark" className="h-6 w-6 text-brand" />
              <h3 className="mt-3 font-semibold text-brand-dark">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="The team" title="The people you'll talk to" />
        <p className="mt-3 text-center">
          <span className="rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-dark">
            {about.teamLabel}
          </span>
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {about.team.map((m) => (
            <li key={m.name} className="rounded-2xl p-6 text-center ring-1 ring-slate-200">
              {/* Placeholder avatar: initials instead of a photo */}
              <span
                className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand"
                aria-hidden
              >
                {m.initials}
              </span>
              <h3 className="mt-4 font-semibold text-brand-dark">{m.name}</h3>
              <p className="text-sm font-medium text-brand">{m.role}</p>
              <p className="mt-3 text-sm text-muted">{m.bio}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Process tone="light" />
      <CtaBand />
    </>
  );
}
