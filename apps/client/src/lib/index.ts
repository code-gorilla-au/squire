/**
 * Sleep for a given amount of time
 * @param ms time in milliseconds
 */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const SECOND = 1000;
