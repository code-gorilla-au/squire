import type { PullRequest, Repository } from "squire-github";
import { describe, expect, it } from "vitest";
import {
	generatePullRequestFromGhModel,
	severityWeighting,
} from "./transforms";

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
		const nodes = {
			pullRequests: {
				nodes: [ghModel],
			},
		} as Repository;
		const repositoryName = "repoName";
		const owner = "owner";
		const repoName = "repoName";

		it("should return a new id", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].id).not.toBe("");
		});
		it("should map title from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].title).toBe(ghModel.title);
		});
		it("should map repositoryName from input", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].repositoryName).toBe(repositoryName);
		});
		it("should map repoOwner from input", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].repoOwner).toBe(owner);
		});
		it("should map repoName from input", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].repoName).toBe(repoName);
		});

		it("should map url from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].url).toBe(ghModel.permalink);
		});
		it("should map state from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].state).toBe(ghModel.state);
		});
		it("should map author from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].author).toBe(ghModel.author.login);
		});
		it("should map mergedAt from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].mergedAt).toBe(ghModel.mergedAt);
		});
		it("should map createdAt from ghModel", () => {
			const result = generatePullRequestFromGhModel(
				nodes,
				repositoryName,
				owner,
				repoName,
			);
			expect(result[0].createdAt).toBe(ghModel.createdAt);
		});
	});
});
