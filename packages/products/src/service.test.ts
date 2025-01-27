import { randomUUID } from "node:crypto";
import { initDB } from "database";
import type { Client } from "squire-github";
import { yesterday } from "time";
import { logger } from "toolbox";
import { type Mocked, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductRepository } from "./repository";
import { ProductService } from "./service";

describe("service", async () => {
	const ghClient = {
		searchRepos: vi.fn(),
	} as Mocked<Client>;
	const db = await initDB(":memory:");
	const repo = new ProductRepository(db, logger);
	await repo.initTables();

	const service = new ProductService(repo, logger, ghClient);

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
			state: "OPEN",
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
			state: "OPEN",
			repositoryName: repoName,
			createdAt: yesterday(),
			updatedAt: yesterday(),
		},
	]);

	describe("getAllOpenPullRequests()", () => {
		it("should return all open pull requests", async () => {
			const pullRequests = await service.getAllOpenPullRequests();

			expect(pullRequests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: "test",
						state: "OPEN",
					}),
				]),
			);
		});
	});

	describe("getAllSecurityAdvisories()", () => {
		it("should return all security advisories", async () => {
			const advisories = await service.getAllOpenSecurityAdvisories();

			expect(advisories).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						packageName: "test",
						severity: "CRITICAL",
						state: "OPEN",
					}),
				]),
			);
		});
	});

	describe("getOpenSecurityAdvisoryByProductId()", async () => {
		const products = await service.getAllProducts();
		const productId = products[0].id;

		it("should return security advisories", async () => {
			const advisories =
				await service.getOpenSecurityAdvisoryByProductId(productId);

			expect(advisories).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						packageName: "test",
						severity: "CRITICAL",
						state: "OPEN",
					}),
				]),
			);
		});
		it("should return empty if product id does not exist", async () => {
			await expect(
				service.getOpenSecurityAdvisoryByProductId("non"),
			).rejects.toThrowError();
		});
	});

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

	describe("createProduct()", () => {
		it("should create product", async () => {
			await expect(
				service.createProduct("test3", ["test"]),
			).resolves.not.toThrow();
		});
		it("should throw error on creating existing product", async () => {
			await expect(service.createProduct("test3", ["test"])).rejects.toThrow();
		});
	});

	describe("getAllProducts()", () => {
		it("should return all products", async () => {
			const products = await service.getAllProducts();

			expect(products).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: repoName,
						tags: [tag],
					}),
				]),
			);
		});
	});

	describe("getProductById()", () => {
		it("should return product", async () => {
			const products = await service.getAllProducts();
			const product = await service.getProductById(products[0].id);

			expect(product).toEqual(
				expect.objectContaining({
					name: repoName,
					tags: [tag],
				}),
			);
		});
	});

	describe("updateProduct()", () => {
		it("should update product", async () => {
			const products = await service.getAllProducts();

			await expect(
				service.updateProduct(products[0].id, "test99", ["test"]),
			).resolves.not.toThrow();
		});
		it("should throw error if product does not exist", async () => {
			const products = await service.getAllProducts();

			await expect(
				service.updateProduct(products[0].id, "test99", ["test"]),
			).rejects.toThrow();
		});
	});

	describe("getReposByProductId()", () => {
		it("should return repos by product id", async () => {
			const products = await service.getAllProducts();

			const repos = await service.getReposByProductId(products[0].id);

			expect(repos).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: repoName,
						owner: owner,
						topic: tag,
					}),
				]),
			);
		});
		it("should return empty if product id does not exist", async () => {
			await expect(service.getReposByProductId("non")).rejects.toThrowError();
		});
	});

	describe("getPullRequestsByProductId()", () => {
		it("should return pull requests by product id", async () => {
			const products = await service.getAllProducts();

			const pullRequests = await service.getPullRequestsByProductId(
				products[0].id,
			);

			expect(pullRequests).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						title: "test",
						state: "OPEN",
					}),
				]),
			);
		});
		it("should return empty if product id does not exist", async () => {
			await expect(
				service.getPullRequestsByProductId("non"),
			).rejects.toThrowError();
		});
	});

	describe("syncProducts()", () => {
		beforeEach(() => {
			ghClient.searchRepos.mockResolvedValue({
				data: {
					search: {
						pageInfo: {
							endCursor: null,
							hasNextPage: false,
						},
						edges: [
							{
								node: {
									name: repoName,
									owner: {
										login: owner,
									},
									url: "url",
									vulnerabilityAlerts: {
										pageInfo: {
											endCursor: null,
											hasNextPage: false,
										},
										nodes: [
											{
												state: "OPEN",
												id: randomUUID(),
												number: 1,
												securityVulnerability: {
													package: {
														name: "test",
													},
													advisory: {
														severity: "CRITICAL",
													},
													firstPatchedVersion: {
														identifier: "1.0.0",
													},
													updatedAt: yesterday(),
												},
												createdAt: yesterday(),
											},
										],
									},
									pullRequests: {
										pageInfo: {
											endCursor: null,
											hasNextPage: false,
										},
										nodes: [],
									},
								},
							},
						],
					},
				},
			});
		});
		it("should sync products", async () => {
			await expect(service.syncProducts()).resolves.not.toThrow();
		});
		it("should throw error if sync fails", async () => {
			ghClient.searchRepos.mockRejectedValue(new Error("error"));

			await expect(service.syncProducts()).rejects.toThrow();
		});
	});
});
