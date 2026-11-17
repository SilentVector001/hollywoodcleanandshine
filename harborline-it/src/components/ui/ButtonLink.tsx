import Link from "next/link";

type Variant = "primary" | "accent" | "outline" | "ghost-light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-dark",
  accent: "bg-accent text-brand-dark shadow-sm hover:brightness-95",
  outline: "border border-brand/30 bg-white text-brand-dark hover:border-brand hover:bg-brand-light",
  "ghost-light": "border border-white/30 text-white hover:bg-white/10",
};

export function buttonClasses(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} className={buttonClasses(variant, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}
