import type { Metadata, Viewport } from "next";
import { brand } from "@config/brand";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.company.siteUrl),
  title: { default: brand.seo.title, template: `%s | ${brand.company.name}` },
  description: brand.seo.description,
  keywords: brand.seo.keywords,
  applicationName: brand.company.name,
  openGraph: {
    type: "website",
    siteName: brand.company.name,
    title: brand.seo.title,
    description: brand.seo.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: brand.seo.title, description: brand.seo.description },
  alternates: { canonical: "/" },
  // Keep the demo out of search engines; real clients set demo.enabled = false.
  robots: brand.demo.enabled ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: brand.colors.primary,
};

/** Brand colors from config → CSS variables consumed by Tailwind (see globals.css). */
const brandVars = {
  "--brand-primary": brand.colors.primary,
  "--brand-primary-dark": brand.colors.primaryDark,
  "--brand-primary-light": brand.colors.primaryLight,
  "--brand-accent": brand.colors.accent,
} as React.CSSProperties;

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.company.name,
  description: brand.company.shortDescription,
  url: brand.company.siteUrl,
  telephone: brand.company.phone.display,
  email: brand.company.email,
  areaServed: brand.company.serviceArea,
  address: {
    "@type": "PostalAddress",
    addressLocality: brand.company.city,
    addressRegion: brand.company.state,
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" style={brandVars} className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <DemoBanner />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
