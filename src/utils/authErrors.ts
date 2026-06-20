/**
 * Maps Firebase Auth error messages to user-friendly text descriptions.
 */
export const getAuthErrorMessage = (error: unknown): string => {
  const msg = error instanceof Error ? error.message : 'An error occurred';
  if (msg.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (msg.includes('auth/email-already-in-use')) return 'This email is already registered.';
  if (msg.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
  if (msg.includes('auth/user-not-found')) return 'No user found with this email.';
  if (msg.includes('auth/unauthorized-domain')) {
    return 'This domain is not authorized in your Firebase Console. Please add your Netlify URL to the "Authorized Domains" list.';
  }
  return msg;
};
