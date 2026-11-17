import Link from "next/link";
import { brand } from "@config/brand";

/** Text wordmark + square mark, both driven by brand.logo and brand.colors. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      aria-label={`${brand.company.name} home`}
    >
      <LogoMark />
      <span
        className={`text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-brand-dark"}`}
      >
        {brand.logo.text}
        <span className={inverted ? "text-accent" : "text-brand"}> {brand.logo.suffix}</span>
      </span>
    </Link>
  );
}

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand text-white shadow-sm ${className}`}
      aria-hidden
    >
      <span className="text-base font-extrabold leading-none">{brand.logo.mark}</span>
      {/* small wave under the letter */}
      <svg viewBox="0 0 36 8" className="absolute bottom-1 left-1/2 w-[70%] -translate-x-1/2" fill="none">
        <path
          d="M1 4c4 0 4-3 8.5-3S14 4 18 4s4.5-3 8.5-3S31 4 35 4"
          stroke="var(--brand-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
