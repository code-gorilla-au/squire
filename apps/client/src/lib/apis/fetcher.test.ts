import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetcher } from "./fetcher.ts";
import { ApiError } from "./types.ts";

describe("fetcher()", () => {
	const fetchResp = {
		ok: true,
		status: 200,
		json: vi.fn(),
		headers: {
			get: vi.fn().mockReturnValue({ "content-length": "100" }),
		},
		hooks: vi.fn(),
	};

	const mockFetch = vi.fn().mockImplementation(() => {
		return Promise.resolve(fetchResp);
	});

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should return response body on success", async () => {
		fetchResp.json.mockResolvedValue("response");

		const response = await fetcher("url");
		expect(response).toBe("response");
	});

	it("should reject on non-2xx status code", async () => {
		mockFetch.mockResolvedValue({
			...fetchResp,
			ok: false,
			json: vi.fn().mockResolvedValue({
				title: "error",
				message: "error",
				detail: "error",
			}),
		});

		await expect(fetcher("url")).rejects.toEqual(
			new ApiError({
				title: "error",
				message: "error",
				detail: "error",
				statusCode: 400,
			}),
		);
	});
	it("should make a post call", async () => {
		mockFetch.mockResolvedValue({
			...fetchResp,
			ok: true,
			json: vi.fn().mockResolvedValue("response"),
		});

		fetchResp.json.mockResolvedValue("response");
		await expect(fetcher("url", { method: "POST" })).resolves.toBe("response");
	});
	it("should make a get call", async () => {
		mockFetch.mockResolvedValue({
			...fetchResp,
			ok: true,
			json: vi.fn().mockResolvedValue("response"),
		});

		fetchResp.json.mockResolvedValue("response");
		await expect(fetcher("url", { method: "GET" })).resolves.toBe("response");
	});
	it("should sent body with post", async () => {
		const expected = {
			hello: "world",
		};
		mockFetch.mockResolvedValue({
			...fetchResp,
			ok: true,
			json: vi.fn().mockResolvedValue(expected),
		});

		fetchResp.json.mockResolvedValue("response");
		await expect(
			fetcher("url", { method: "GET", body: JSON.stringify(expected) }),
		).resolves.toHaveProperty("hello", "world");
	});
});
