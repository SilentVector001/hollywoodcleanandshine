import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Single shared Prisma client.
 *
 * Local dev uses SQLite (DATABASE_URL="file:./dev.db"). To switch to Postgres,
 * change the provider in prisma/schema.prisma and swap the adapter here for
 * @prisma/adapter-pg (see README).
 */
function createClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
