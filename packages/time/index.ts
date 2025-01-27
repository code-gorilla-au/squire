import { differenceInMinutes, formatDistanceToNow } from "date-fns";

/**
 * Sleep for a given amount of time
 * @param ms time in milliseconds
 */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get yesterday's date
 */
export function yesterday() {
	const d = new Date();
	d.setDate(d.getDate() - 1);
	return d;
}

/**
 * Time constant second
 */
export const SECOND = 1000;

/**
 * Time constant minute
 */
export const MINUTE = 60 * SECOND;

/**
 * Compare two dates and return the difference in minutes
 * @param dateLeft later date
 * @param dateRight earlier date
 */
export function diffMinutes(dateLeft: Date, dateRight: Date): number {
	return differenceInMinutes(dateLeft, dateRight);
}

export function formatFromNow(date: Date): string {
	return formatDistanceToNow(date);
}
