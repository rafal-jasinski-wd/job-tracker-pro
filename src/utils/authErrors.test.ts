import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from './authErrors';

describe('getAuthErrorMessage', () => {
  it('should format general Error messages', () => {
    expect(getAuthErrorMessage(new Error('Something failed'))).toBe('Something failed');
  });

  it('should map invalid credentials error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: Error (auth/invalid-credential).'))).toBe('Invalid email or password.');
  });

  it('should map email already in use error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: Error (auth/email-already-in-use).'))).toBe('This email is already registered.');
  });

  it('should map weak password error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: Error (auth/weak-password).'))).toBe('Password should be at least 6 characters.');
  });

  it('should map user not found error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: Error (auth/user-not-found).'))).toBe('No user found with this email.');
  });

  it('should map unauthorized domain error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: Error (auth/unauthorized-domain).'))).toBe(
      'This domain is not authorized in your Firebase Console. Please add your Netlify URL to the "Authorized Domains" list.'
    );
  });

  it('should handle non-Error inputs gracefully', () => {
    expect(getAuthErrorMessage('Unknown string error')).toBe('An error occurred');
    expect(getAuthErrorMessage(null)).toBe('An error occurred');
  });
});
