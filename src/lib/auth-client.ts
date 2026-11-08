import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client instance for browser and React components.
 * Uses window.location.origin in the browser to ensure requests match
 * the active host (aveezahvaganza.com vs www.aveezahvaganza.com vs localhost)
 * avoiding cross-origin credential issues.
 */
const resolveClientBaseURL = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'https://aveezahvaganza.com';
};

export const authClient: any = createAuthClient({
  baseURL: resolveClientBaseURL(),
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
