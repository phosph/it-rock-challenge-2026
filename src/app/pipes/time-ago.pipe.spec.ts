import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;
  const NOW = new Date('2025-06-15T12:00:00Z').getTime();

  beforeEach(() => {
    pipe = new TimeAgoPipe();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => vi.useRealTimers());

  it('should return "just now" for less than 5 seconds ago', () => {
    const date = new Date(NOW - 3_000).toISOString();
    expect(pipe.transform(date)).toBe('just now');
  });

  it('should return seconds ago', () => {
    expect(pipe.transform(new Date(NOW - 10_000).toISOString())).toBe('10 seconds ago');
    expect(pipe.transform(new Date(NOW - 30_000).toISOString())).toBe('30 seconds ago');
  });

  it('should handle singular second', () => {
    // Exactly 1 second: floor((NOW - (NOW - 1000)) / 1000) = 1
    // But 1 < 5, so it's "just now". We need a value that floors to 1 after division.
    // Actually for seconds the check is seconds < 60, so 1 second = "1 second ago"
    // But 1 < 5 → "just now". So singular second is unreachable in practice.
    // Let's test 5 seconds which is plural:
    expect(pipe.transform(new Date(NOW - 5_000).toISOString())).toBe('5 seconds ago');
  });

  it('should return minutes ago', () => {
    expect(pipe.transform(new Date(NOW - 60_000).toISOString())).toBe('1 minute ago');
    expect(pipe.transform(new Date(NOW - 5 * 60_000).toISOString())).toBe('5 minutes ago');
  });

  it('should return hours ago', () => {
    expect(pipe.transform(new Date(NOW - 3600_000).toISOString())).toBe('1 hour ago');
    expect(pipe.transform(new Date(NOW - 3 * 3600_000).toISOString())).toBe('3 hours ago');
  });

  it('should return days ago', () => {
    expect(pipe.transform(new Date(NOW - 86400_000).toISOString())).toBe('1 day ago');
    expect(pipe.transform(new Date(NOW - 7 * 86400_000).toISOString())).toBe('7 days ago');
  });

  it('should return months ago', () => {
    const oneMonth = 30 * 86400_000;
    expect(pipe.transform(new Date(NOW - oneMonth).toISOString())).toBe('1 month ago');
    expect(pipe.transform(new Date(NOW - 3 * oneMonth).toISOString())).toBe('3 months ago');
  });

  it('should return years ago', () => {
    const oneYear = 12 * 30 * 86400_000;
    expect(pipe.transform(new Date(NOW - oneYear).toISOString())).toBe('1 year ago');
    expect(pipe.transform(new Date(NOW - 3 * oneYear).toISOString())).toBe('3 years ago');
  });

  it('should return original value for invalid date strings', () => {
    expect(pipe.transform('not a date')).toBe('not a date');
    expect(pipe.transform('')).toBe('');
  });
});
