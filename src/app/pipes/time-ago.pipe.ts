import { Pipe, PipeTransform } from '@angular/core';

const INTERVALS: [number, string, string][] = [
  [60, 'second', 'seconds'],
  [60, 'minute', 'minutes'],
  [24, 'hour', 'hours'],
  [30, 'day', 'days'],
  [12, 'month', 'months'],
  [Infinity, 'year', 'years'],
];

/**
 * Pure pipe that converts an ISO date string into a human-readable relative time
 * (e.g. "just now", "5 minutes ago", "2 hours ago"). Returns the original value
 * unchanged if it is not a valid date string.
 *
 * @example
 * ```html
 * <time>{{ comment.createdAt | timeAgo }}</time>
 * <!-- Output: "5 minutes ago" -->
 * ```
 */
@Pipe({ name: 'timeAgo', pure: true })
export class TimeAgoPipe implements PipeTransform {
  /** @param value ISO date string to convert to relative time. */
  transform(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    let seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';

    for (const [divisor, singular, plural] of INTERVALS) {
      if (seconds < divisor) {
        return `${seconds} ${seconds === 1 ? singular : plural} ago`;
      }
      seconds = Math.floor(seconds / divisor);
    }

    return value;
  }
}
