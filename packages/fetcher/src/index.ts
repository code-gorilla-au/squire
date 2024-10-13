import { fetch } from "bun";
import type { Result } from "./types";

export * from "./types";

export function initClient(token: string) {
	return {
		async post(url: string, body: Record<string, unknown>): Promise<Result<T>> {
			const resp = await fetch(url, {
				headers: {
					authorization: `bearer ${token}`,
				},
				method: "POST",
				body: JSON.stringify(body),
			});

			if (!resp.ok) {
				return Promise.resolve({
					statusCode: resp.status,
					statusText: resp.statusText,
				});
			}
		},
	};
}
