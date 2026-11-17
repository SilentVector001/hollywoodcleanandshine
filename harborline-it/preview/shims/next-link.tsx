import { PREVIEW_PAGES, previewStore } from "../store";

/** Stand-in for next/link in the static preview: site paths become #hash views. */
const ROUTES: Record<string, string> = { "/": "home", "/about": "about", "/contact": "contact", "/risk-check": "risk-check" };

export function toHash(href: string): string {
  if (/^(https?:|tel:|mailto:|#)/.test(href)) return href;
  const [pathAndQuery, fragment] = href.split("#");
  const path = pathAndQuery.split("?")[0] || "/";
  if (path === "/" && fragment) return `#${fragment}`;
  return `#${ROUTES[path] ?? "home"}`;
}

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export default function Link({ href, onClick, ...rest }: Props) {
  const target = toHash(href);
  const plan = new URLSearchParams(href.split("?")[1]?.split("#")[0] ?? "").get("plan") ?? "";
  return (
    <a
      href={target}
      onClick={(e) => {
        previewStore.plan = plan;
        // Clicking a link to the view you're already on: scroll instead of doing nothing.
        if (target.startsWith("#") && window.location.hash === target) {
          e.preventDefault();
          const id = target.slice(1);
          if (PREVIEW_PAGES.includes(id)) window.scrollTo({ top: 0 });
          else document.getElementById(id)?.scrollIntoView();
        }
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
