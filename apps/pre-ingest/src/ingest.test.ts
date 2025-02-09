import { afterAll, beforeAll, describe, it, vi } from "vitest";

import { initDB } from "database";
import { ProductRepository, ProductService } from "products";
import { serverLogger } from "toolbox";
import { IngestService } from "./ingest";
import { randomUUID } from "node:crypto";
import { yesterday } from "time";

const logger = serverLogger("debug");

describe("IngestService", async () => {
	const mockGhClient = {
		searchRepos: vi.fn(),
	};
	const db = await initDB(":memory:");
	const repo = new ProductRepository(db, logger);
	const service = new ProductService(repo, logger, mockGhClient);

	beforeAll(async () => {
		await repo.initTables();
		mockGhClient.searchRepos.mockResolvedValue({
			data: {
				search: {
					pageInfo: {
						endCursor: null,
						hasNextPage: false,
					},
					edges: [
						{
							node: {
								name: "repoName",
								owner: {
									login: "owner",
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

	afterAll(async () => {
		await db.close();
	});

	it("should create products for each topic", async () => {
		const ingest = new IngestService(logger, service);

		const topics = ["topic1", "topic2"];
		await ingest.ingest(topics);
	});
});
