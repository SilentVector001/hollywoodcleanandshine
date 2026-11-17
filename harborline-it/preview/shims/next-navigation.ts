import { previewStore } from "../store";

/** Stand-in for next/navigation in the static preview. */
export function useSearchParams() {
  return new URLSearchParams(previewStore.plan ? { plan: previewStore.plan } : {});
}

export function usePathname() {
  return "/";
}

export function redirect(url: string): never {
  throw new Error(`redirect(${url}) is not available in the preview`);
}

export function notFound(): never {
  throw new Error("notFound() is not available in the preview");
}
