import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test_key';

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(window.localStorage.getItem(TEST_KEY)).toBeNull();
  });

  it('should return stored value when localStorage has data', () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify('stored value'));
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    
    expect(result.current[0]).toBe('stored value');
  });

  it('should update state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
    
    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('new value'));
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(1));
  });

  it('should handle JSON parse errors gracefully and return initial value', () => {
    // Suppress console.warn for this test
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    window.localStorage.setItem(TEST_KEY, 'invalid json');
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Error reading localStorage key "${TEST_KEY}":`,
      expect.any(Error)
    );
  });
});
