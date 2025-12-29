import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dns from "dns";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Force IPv4 DNS resolution to avoid IPv6 ENETUNREACH in some hosts (e.g., Render)
const lookupIPv4: (hostname: string, options: any, callback: any) => void = (
  hostname,
  _options,
  callback,
) => dns.lookup(hostname, { family: 4 }, callback);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 10000,
  lookup: lookupIPv4,
});
export const db = drizzle(pool, { schema });
