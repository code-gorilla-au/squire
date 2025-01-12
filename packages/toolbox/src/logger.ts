import pino, { type Level } from "pino";

export const logger = pino({ level: "debug" });

export function serverLogger(level: Level) {
	const l = pino({ level });
	return l;
}

export function omitSecretProperties<T>(obj: T, ...props: string[]): T {
	const copy = { ...obj };
	for (const prop of props) {
		delete copy[prop as keyof T];
	}
	return copy;
}
