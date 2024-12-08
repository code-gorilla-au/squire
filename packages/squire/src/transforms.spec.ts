import { describe, it, expect } from "vitest";
import {
	generatePullRequestFromGhModel,
	severityWeighting,
} from "./transforms";
import type { PullRequest } from "squire-github";

describe("transforms", () => {
	describe("severityWeighting()", () => {
		it("should return 4 for critical", () => {
			expect(severityWeighting("CRITICAL")).toBe(4);
		});
		it("should return 3 for high", () => {
			expect(severityWeighting("HIGH")).toBe(3);
		});
		it("should return 2 for moderate", () => {
			expect(severityWeighting("MODERATE")).toBe(2);
		});
		it("should return 1 for low", () => {
			expect(severityWeighting("LOW")).toBe(1);
		});
	});
	describe("generatePullRequestFromGhModel()", () => {
		const ghModel: PullRequest = {
			id: "123",
			title: "title",
			permalink: "url",
			state: "OPEN",
			author: {
				login: "author",
			},
			createdAt: new Date(),
			mergedAt: new Date(),
		};
		const repositoryName = "repoName";
		const owner = "owner";
		const repoName = "repoName";

		it("should return a new id", () => {
			const result = generatePullRequestFromGhModel(
				{[ghModel]},
				repositoryName,
				owner,
				repoName,
			);
		});
	});
});
