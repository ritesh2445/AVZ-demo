import { bootstrapDatabaseSchema, getDb } from '../src/lib/db';
import { auth } from '../src/lib/auth-better';

async function testSuite() {
  console.log('--- 1. Testing Database Migration & Schema Bootstrap ---');
  await bootstrapDatabaseSchema();

  const db = getDb();
  // Verify Better Auth tables exist
  const tableCheck = await db.execute(`
    SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user', 'session', 'account', 'verification', 'rateLimit');
  `);
  const foundTables = tableCheck.rows.map((r: any) => r.name);
  console.log('Provisioned Better Auth tables:', foundTables);
  if (foundTables.length < 5) {
    throw new Error(`Expected 5 Better Auth tables, found: ${foundTables.join(', ')}`);
  }
  console.log('[PASS] All 5 Better Auth tables exist in database.');

  console.log('\n--- 2. Testing Email & Password Registration ---');
  const testEmail = `vip_${Date.now()}@avzvaganza.com`;
  const testPassword = 'Password123!';
  const testName = 'Aura Valerius';

  const signUpRes = await auth.api.signUpEmail({
    body: {
      email: testEmail,
      password: testPassword,
      name: testName,
    },
  });

  if (!signUpRes || !signUpRes.user) {
    throw new Error('Sign up returned empty user.');
  }
  console.log('[PASS] User registered successfully:');
  console.log(`  User ID: ${signUpRes.user.id}`);
  console.log(`  Email: ${signUpRes.user.email}`);
  console.log(`  Name: ${signUpRes.user.name}`);

  console.log('\n--- 3. Testing Email & Password Authentication ---');
  const signInResponse = await auth.api.signInEmail({
    body: {
      email: testEmail,
      password: testPassword,
    },
    asResponse: true,
  });

  const cookieHeader = signInResponse.headers.get('set-cookie');
  console.log(`[PASS] User signed in! Set-Cookie:`, cookieHeader?.slice(0, 50));

  console.log('\n--- 4. Testing Server-side Session Verification ---');
  const authHeaders = new Headers();
  if (cookieHeader) {
    authHeaders.set('cookie', cookieHeader);
  }

  const verifiedSession = await auth.api.getSession({
    headers: authHeaders,
  });

  console.log('Session result:', verifiedSession ? 'Session found' : 'No session');
  if (!verifiedSession || !verifiedSession.user || verifiedSession.user.email !== testEmail) {
    throw new Error('Session verification failed.');
  }
  console.log('[PASS] Server-side session verified:');
  console.log(`  Verified User: ${verifiedSession.user.name} (${verifiedSession.user.email})`);
  console.log(`  Session ID: ${verifiedSession.session.id}`);

  console.log('\n--- 5. Testing Forgot Password / Password Reset Dispatch ---');
  const resetRes = await auth.api.requestPasswordReset({
    body: {
      email: testEmail,
      redirectTo: 'http://localhost:3000/reset-password',
    },
  });
  console.log('[PASS] Password reset request processed successfully:', resetRes);

  console.log('\n--- 6. Testing Rate Limiting (Database Backed) ---');
  const rateLimitCheck = await db.execute(`SELECT * FROM rateLimit`);
  console.log(`[PASS] rateLimit table active, stored records: ${rateLimitCheck.rows.length}`);

  console.log('\n--- ALL BETTER AUTH TESTS PASSED SUCCESSFULLY ---');
  process.exit(0);
}

testSuite().catch((err) => {
  console.error('\n[TEST FAILED]:', err);
  process.exit(1);
});
