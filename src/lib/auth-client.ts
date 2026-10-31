import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client instance for browser and React components.
 * Automatically handles session cookies, Google OAuth redirection,
 * email verification, and password resets.
 */
export const authClient: any = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  verifyEmail,
} = authClient;
