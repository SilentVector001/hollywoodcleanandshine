import type { Feature } from "@config/brand";
import { Icon } from "@/components/Icon";

/** Shared card grid used by "Problems" and "Why us". */
export function FeatureGrid({ items, variant = "card" }: { items: Feature[]; variant?: "card" | "plain" }) {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.title}
          className={
            variant === "card"
              ? "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              : "p-2"
          }
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Icon name={item.icon} />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-brand-dark">{item.title}</h3>
          <p className="mt-2 text-muted">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
