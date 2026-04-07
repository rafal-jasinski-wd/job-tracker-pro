/**
 * Checks if a URL is safe to use as an href.
 * Prevents javascript: and other non-http(s) URIs from being rendered as links.
 */
export const isSafeUrl = (url?: string): boolean =>
  !!url && /^https?:\/\//i.test(url.trim());
