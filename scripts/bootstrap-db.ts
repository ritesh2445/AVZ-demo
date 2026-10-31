import { bootstrapDatabaseSchema } from '../src/lib/db';

async function main() {
  console.log('[DB BOOTSTRAP] Initializing database schema, indexes, and initial seeds...');
  const start = Date.now();
  try {
    await bootstrapDatabaseSchema();
    console.log(`[DB BOOTSTRAP] Successfully applied database migrations in ${Date.now() - start}ms.`);
    process.exit(0);
  } catch (err) {
    console.error('[DB BOOTSTRAP] Migration failed:', err);
    process.exit(1);
  }
}

main();
