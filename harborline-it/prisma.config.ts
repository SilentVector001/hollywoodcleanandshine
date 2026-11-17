import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// The Prisma CLI doesn't read .env files on its own. Load the same files
// Next.js uses (.env.local wins). Real environment variables are never
// overridden, so hosting platforms like Vercel behave as expected.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
