import { describe, it, expect } from 'vitest';
import { formatDate } from './dateUtils';

describe('formatDate', () => {
  it('should format YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('2023-10-27')).toBe('27/10/2023');
  });

  it('should format ISO strings to DD/MM/YYYY', () => {
    expect(formatDate('2023-10-27T10:00:00Z')).toBe('27/10/2023');
  });

  it('should handle single digit days and months', () => {
    expect(formatDate('2023-01-05')).toBe('05/01/2023');
  });

  it('should return "-" for null or undefined', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
    expect(formatDate('')).toBe('-');
  });

  it('should return the original string if it is not a valid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
