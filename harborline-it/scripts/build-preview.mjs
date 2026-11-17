/**
 * Builds a self-contained, browser-only preview of the site into
 * preview/dist/index.html (one file: CSS + JavaScript inlined).
 *
 * It reuses the real page components. Server-only pieces are swapped out:
 * next/link and next/navigation get small stand-ins, the Risk Check and
 * contact form submits run in the browser, and the chat uses demo mode.
 * Nothing in the preview is saved.
 *
 * Usage: npm run build && npm run preview:build
 */
import { build } from "esbuild";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const chunksDir = path.join(root, ".next/static/chunks");
if (!existsSync(chunksDir)) {
  console.error("No Next.js build found. Run `npm run build` first (it produces the site's CSS).");
  process.exit(1);
}
const css = readdirSync(chunksDir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(path.join(chunksDir, f), "utf8"))
  .join("\n");

const file = (p) => path.join(root, p);

const previewSwaps = {
  name: "preview-swaps",
  setup(b) {
    b.onResolve({ filter: /^next\/link$/ }, () => ({ path: file("preview/shims/next-link.tsx") }));
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: file("preview/shims/next-navigation.ts") }));
    b.onResolve({ filter: /^\.\/actions$/ }, (args) => {
      if (args.importer.endsWith(path.join("risk-check", "RiskCheckQuiz.tsx"))) {
        return { path: file("preview/stubs/risk-check-actions.ts") };
      }
      if (args.importer.includes(path.join("app", "contact"))) return { path: file("preview/stubs/contact-actions.ts") };
      return { errors: [{ text: `Unexpected server action import in ${args.importer}` }] };
    });
    // Safety net: database and API-key code must never end up in a browser bundle.
    b.onResolve({ filter: /^(@\/lib\/db|@\/lib\/leads|@\/generated\/|@prisma\/|@anthropic-ai\/sdk|@\/lib\/assistant\/claude)/ }, (args) => ({
      errors: [{ text: `Server-only module "${args.path}" imported by ${args.importer}` }],
    }));
  },
};

const result = await build({
  entryPoints: [file("preview/entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  write: false,
  legalComments: "none",
  logLevel: "error",
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  },
  plugins: [previewSwaps],
});

const brandSource = readFileSync(file("config/brand.ts"), "utf8");
const companyName = brandSource.match(/name:\s*"([^"]+)"/)?.[1] ?? "Site";
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html = `<!DOCTYPE html>
<html lang="en" class="h-full antialiased">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${companyName} (preview)</title>
<style>${css}</style>
</head>
<body class="flex min-h-full flex-col font-sans">
<div id="root" class="flex min-h-full flex-1 flex-col"></div>
<script>${js}</script>
</body>
</html>
`;

mkdirSync(file("preview/dist"), { recursive: true });
writeFileSync(file("preview/dist/index.html"), html);
console.log(`Preview written to preview/dist/index.html (${Math.round(html.length / 1024)} KB)`);
