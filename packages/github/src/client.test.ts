import { describe, expect, it } from "vitest";
import { mergeOptions } from "./client";

describe("mergeOptions()", () => {
	it("should return default options if no options are provided", () => {
		expect(
			mergeOptions(
				{
					ghToken: "fake",
					defaultOwner: "default-owner",
					defaultTopics: ["flash"],
				},
				{},
			),
		).toEqual({
			owner: "default-owner",
			topics: ["flash"],
		});
	});
});
