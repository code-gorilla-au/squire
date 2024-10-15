const ghUrl = "https://api.github.com/graphql";

/**
 * Github post request
 * @param token gh token (PAT token)
 * @param body object to be serialised
 */
export async function post<T>(
	token: string,
	body: Record<string, unknown>,
): Promise<T> {
	return fetch(ghUrl, {
		headers: {
			authorization: `bearer ${token}`,
		},
		method: "POST",
		body: JSON.stringify(body),
	}).then((resp) => {
		return resp.json() as Promise<T>;
	});
}
