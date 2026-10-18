import { describe, it, expect } from 'vitest';
import { formatDuration, formatNumber, v4, cn } from '@/lib/utils';

describe('Utility Helpers', () => {
  describe('cn (classNames)', () => {
    it('merges class names and handles conditional classes', () => {
      expect(cn('px-2 py-1', 'bg-blue-500', false && 'hidden')).toBe('px-2 py-1 bg-blue-500');
    });

    it('resolves conflicting tailwind classes', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });
  });

  describe('formatDuration', () => {
    it('formats seconds into mm:ss', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(600)).toBe('10:00');
    });

    it('formats seconds into hh:mm:ss for longer durations', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('handles zero or invalid duration', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers into abbreviated strings', () => {
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(2000000)).toBe('2M');
    });

    it('handles null/undefined gracefully', () => {
      expect(formatNumber(null)).toBe('N/A');
    });
  });

  describe('v4', () => {
    it('generates valid non-empty UUID string', () => {
      const id1 = v4();
      const id2 = v4();
      expect(id1).toHaveLength(36);
      expect(id1).not.toBe(id2);
    });
  });
});
