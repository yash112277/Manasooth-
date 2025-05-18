
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    const hasError = false;
    expect(cn('base', isActive && 'active', hasError && 'error')).toBe('base active');
  });

  it('should handle mixed types of arguments', () => {
    expect(cn('p-4', { 'font-bold': true, 'text-lg': false }, ['m-2', 'block'])).toBe('p-4 font-bold m-2 block');
  });

  it('should correctly merge conflicting Tailwind classes', () => {
    // Example: p-2 and p-4, twMerge should resolve to the last one (p-4)
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('should return an empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should handle falsy values gracefully', () => {
    expect(cn('text-red', null, undefined, false, 'bg-blue')).toBe('text-red bg-blue');
  });
});
