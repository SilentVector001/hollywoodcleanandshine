import { brand } from "@config/brand";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-dark">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-muted">
        It may have moved. You can head back home or call us at {brand.company.phone.display}.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
