export type Result<T> = Success<T> | Failure<T>;

export type Failure<T> = {
	data?: T | Record<string, unknown> | undefined;
	error: Error;
	statusCode: number;
	statusText: string;
};

export type Success<T> = {
	error: never;
	data: T;
};
