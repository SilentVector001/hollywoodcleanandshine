import Link from "next/link";
import { brand } from "@config/brand";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";

export function SiteFooter() {
  const { company } = brand;
  return (
    <footer className="bg-brand-dark text-white/80 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm">{company.tagline}</p>
          <p className="mt-4 text-xs text-white/60">{brand.legal.hipaaDisclaimer}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {brand.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a href={company.phone.href} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="phone" className="h-4 w-4" /> {company.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="inline-flex items-center gap-2 break-all hover:text-white">
                <Icon name="mail" className="h-4 w-4 shrink-0" /> {company.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <Icon name="map" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{company.mailingAddress}</span>
            </li>
            <li className="inline-flex items-start gap-2">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{company.hours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {company.legalName} · Est. {company.foundedYear} · Serving {company.serviceArea.join(", ")}
          </p>
          {brand.demo.enabled ? <p>Demo site. Fictional company.</p> : null}
        </div>
      </div>
    </footer>
  );
}
