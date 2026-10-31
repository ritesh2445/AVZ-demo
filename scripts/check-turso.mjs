import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in the current shell.");
  console.error("No credentials were printed. Check your local environment configuration.");
  process.exit(1);
}

const db = createClient({ url, authToken });

try {
  const tables = await db.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
  );

  console.log("Turso connection: SUCCESS");
  console.log("Tables found:", tables.rows.map(row => row.name).join(", ") || "(none)");

  for (const table of ["products", "storefront_settings", "orders", "admin_users"]) {
    if (!tables.rows.some(row => row.name === table)) {
      console.log(`${table}: TABLE MISSING`);
      continue;
    }

    const result = await db.execute(`SELECT COUNT(*) AS count FROM "${table}"`);
    console.log(`${table}: ${result.rows[0].count} rows`);
  }
} catch (error) {
  console.error("Turso read-only check failed:", error.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
