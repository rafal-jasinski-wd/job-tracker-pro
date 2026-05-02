import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './urlUtils';

describe('isSafeUrl', () => {
  it('should return true for valid https URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('https://github.com/foo/bar')).toBe(true);
  });

  it('should return true for valid http URLs', () => {
    expect(isSafeUrl('http://insecure-site.com')).toBe(true);
  });

  it('should handle uppercase protocols', () => {
    expect(isSafeUrl('HTTPS://EXAMPLE.COM')).toBe(true);
  });

  it('should handle leading/trailing whitespace', () => {
    expect(isSafeUrl('  https://example.com  ')).toBe(true);
  });

  it('should return false for javascript: payloads', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('javascript:void(0)')).toBe(false);
    expect(isSafeUrl('  javascript:alert(1)  ')).toBe(false);
  });

  it('should return false for data: URIs', () => {
    expect(isSafeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
  });

  it('should return false for relative URLs', () => {
    expect(isSafeUrl('/about')).toBe(false);
    expect(isSafeUrl('page.html')).toBe(false);
  });

  it('should return false for empty or undefined', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
    expect(isSafeUrl('   ')).toBe(false);
  });
});
