import { randomUUID } from "node:crypto";
import { initDB } from "database";
import { yesterday } from "time";
import { describe, expect, it } from "vitest";
import { ProductRepository } from "./repository";
import { logger } from "toolbox";

describe("Repository insights", async () => {
	const db = await initDB(":memory:");
	const repo = new ProductRepository(db, logger);
	await repo.initTables();

	const owner = "owner";
	const repoName = "test1";
	const tag = "test";

	await repo.insertProduct(repoName, [tag]);

	await repo.bulkInsertRepos([
		{
			id: randomUUID(),
			name: repoName,
			owner: owner,
			topic: tag,
			createdAt: yesterday(),
			updatedAt: yesterday(),
			url: "url",
		},
	]);

	await repo.bulkInsertPullRequests([
		{
			id: randomUUID(),
			externalId: randomUUID(),
			title: "test",
			repositoryName: repoName,
			repoOwner: owner,
			repoName: repoName,
			url: "url",
			state: "MERGED",
			author: "author",
			mergedAt: yesterday(),
			createdAt: yesterday(),
			updatedAt: yesterday(),
		},
	]);

	await repo.bulkInsertSecVulnerabilities([
		{
			id: randomUUID(),
			externalId: randomUUID(),
			packageName: "test",
			patchedVersion: "1.0.0",
			severity: "CRITICAL",
			state: "FIXED",
			repositoryName: repoName,
			createdAt: yesterday(),
			updatedAt: yesterday(),
		},
		{
			id: randomUUID(),
			externalId: randomUUID(),
			packageName: "test",
			patchedVersion: "1.0.0",
			severity: "CRITICAL",
			state: "FIXED",
			repositoryName: repoName,
			createdAt: yesterday(),
			updatedAt: yesterday(),
		},
	]);

	describe("pullRequests by organisation", () => {
		it("should return organisation pull requests", async () => {
			const resp = await repo.getPullRequestInsights();
			expect(resp.data).toEqual(
				expect.objectContaining({
					daysToMerge: 0,
					maxDaysToMerge: expect.any(Number),
					minDaysToMerge: expect.any(Number),
					totalMerged: expect.any(Number),
				}),
			);
		});
	});
	describe("pullRequests by organisation and product", async () => {
		const { error, data } = await repo.getAllProducts();
		expect(error).toBeFalsy();

		it("should return pull requests by organisation and product", async () => {
			const productId = (data ?? [{ id: "" }])[0].id;

			const resp = await repo.getPullRequestInsightsByProduct(productId);
			expect(resp.data).toEqual(
				expect.objectContaining({
					daysToMerge: 0,
					maxDaysToMerge: expect.any(Number),
					minDaysToMerge: expect.any(Number),
					totalMerged: expect.any(Number),
				}),
			);
		});
	});
	describe("securityAdvisories by organisation", () => {
		it("should return security advisories by organisation", async () => {
			const resp = await repo.getSecurityAdvisoryInsights();
			expect(resp.error).toBeFalsy();
			expect(resp.data).toEqual(
				expect.objectContaining({
					total: expect.any(Number),
					resolved: expect.any(Number),
					open: expect.any(Number),
					daysToMerge: expect.any(Number),
					maxDaysToMerge: expect.any(Number),
					minDaysToMerge: expect.any(Number),
				}),
			);
		});
	});
});
