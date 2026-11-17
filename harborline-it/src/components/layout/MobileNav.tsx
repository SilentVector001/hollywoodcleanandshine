"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Link as NavLink } from "@config/brand";

export function MobileNav({
  items,
  phone,
  cta,
}: {
  items: NavLink[];
  phone: { display: string; href: string };
  cta: NavLink;
}) {
  const [open, setOpen] = useState(false);

  // Close on Escape and on browser back/forward. (Links in the menu close it
  // themselves.) Not reading the URL keeps every page fully prerenderable.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", close);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-dark hover:bg-brand-light"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-slate-200 bg-white px-4 pb-6 pt-2 shadow-lg sm:px-6"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-slate-800 hover:bg-brand-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <a
              href={phone.href}
              className="rounded-lg border border-brand/30 px-4 py-3 text-center font-semibold text-brand-dark"
            >
              Call {phone.display}
            </a>
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand px-4 py-3 text-center font-semibold text-white"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
