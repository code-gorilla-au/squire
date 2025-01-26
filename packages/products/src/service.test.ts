import { randomUUID } from "node:crypto";
import { initDB } from "database";
import { yesterday } from "time";
import { describe, expect, it } from "vitest";
import { ProductRepository } from "./repository";
import { logger } from "toolbox";
import { ProductService } from "./service";

describe("service", async () => {
	const db = await initDB(":memory:");
	const repo = new ProductRepository(db, logger);
	await repo.initTables();

	const service = new ProductService(repo, logger);

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
	]);
	describe("createProduct()", () => {
		it("should create product", async () => {
			await expect(
				service.createProduct("test2", ["test"]),
			).resolves.not.toThrow();
		});
	});
	describe("getInsights()", () => {
		it("should return pull requests insights", async () => {
			const insights = await service.getInsights();

			expect(insights.pullRequests).toEqual(
				expect.objectContaining({
					daysToMerge: 0,
					maxDaysToMerge: expect.any(Number),
					minDaysToMerge: expect.any(Number),
				}),
			);
		});
		it("should return security advisories insights", async () => {
			const insights = await service.getInsights();

			expect(insights.securityAdvisories).toEqual(
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
	describe("getInsightsByProduct()", async () => {
		const products = await service.getAllProducts();
		const productId = products[0].id;

		it("should return pull requests insights", async () => {
			const insights = await service.getInsightsByProduct(productId);

			expect(insights).toEqual(
				expect.objectContaining({
					pullRequests: expect.objectContaining({
						daysToMerge: 0,
						maxDaysToMerge: expect.any(Number),
						minDaysToMerge: expect.any(Number),
					}),
					securityAdvisories: expect.objectContaining({
						total: expect.any(Number),
						resolved: expect.any(Number),
						open: expect.any(Number),
						daysToMerge: expect.any(Number),
						maxDaysToMerge: expect.any(Number),
						minDaysToMerge: expect.any(Number),
					}),
				}),
			);
		});
		it("should return empty if product id does not exist", async () => {
			await expect(service.getInsightsByProduct("non")).rejects.toThrowError();
		});
	});
	describe("getProductById()", async () => {
		const products = await service.getAllProducts();

		it("should return product", async () => {
			console.log(products[0].id);
			const product = await service.getProductById(products[0].id);

			expect(product).toEqual(
				expect.objectContaining({
					name: repoName,
					tags: [tag],
				}),
			);
		});
	});
});
