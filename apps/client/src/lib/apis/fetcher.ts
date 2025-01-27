import { ApiError, type ApiErrorResponse } from "./types";

/**
 * lightweight wrapper around fetch with default headers which can be overwritten. Treats non 2xx status codes as errors
 * @param url endpoint to fetch
 * @param options fetch option
 */
export async function fetcher<T>(
	url: string | URL | globalThis.Request,
	options?: RequestInit,
): Promise<T> {
	const resp = await fetch(url, {
		headers: {
			...options?.headers,
			"Content-Type": "application/json",
		},
		...options,
	});

	if (!resp?.ok) {
		const apiErr = (await resp?.json()) as ApiErrorResponse;
		console.log(apiErr);
		apiErr.statusCode = resp.status;

		return Promise.reject(new ApiError(apiErr));
	}

	if (resp.headers.get("content-length") === "0") {
		return Promise.resolve({} as T);
	}

	return resp.json() as Promise<T>;
}
