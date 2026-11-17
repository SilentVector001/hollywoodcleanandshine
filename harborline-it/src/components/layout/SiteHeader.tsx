import Link from "next/link";
import { brand } from "@config/brand";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/Icon";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 print:hidden border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {brand.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-light hover:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={brand.company.phone.href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand"
          >
            <Icon name="phone" className="h-4 w-4" />
            {brand.company.phone.display}
          </a>
          <ButtonLink href={brand.headerCta.href} className="!px-4 !py-2 text-sm">
            {brand.headerCta.label}
          </ButtonLink>
        </div>

        <MobileNav
          items={brand.nav}
          phone={brand.company.phone}
          cta={brand.headerCta}
        />
      </div>
    </header>
  );
}
