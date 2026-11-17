import { brand } from "@config/brand";

/** Thin notice shown on every page while brand.demo.enabled is true. */
export function DemoBanner() {
  if (!brand.demo.enabled) return null;
  return (
    <div className="bg-brand-dark px-4 py-2 text-center text-xs font-medium text-white/90 sm:text-sm">
      {brand.demo.bannerText}
    </div>
  );
}
