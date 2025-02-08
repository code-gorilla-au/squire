import { afterAll, beforeAll, describe, it, vi } from "vitest";

import { initDB } from "database";
import type { Level } from "pino";
import { ProductRepository, ProductService } from "products";
import { serverLogger } from "toolbox";
import { loadConfig } from "./env";
import { IngestService } from "./ingest";

const config = loadConfig();
const logger = serverLogger(config.VITE_LOG_LEVEL as Level);

describe("IngestService", async () => {
	const mockGhClient = {
		searchRepos: vi.fn(),
	};
	const db = await initDB(config.VITE_DB_FILE_PATH);
	const repo = new ProductRepository(db, logger);
	const service = new ProductService(repo, logger, mockGhClient);

	beforeAll(async () => {
		await repo.initTables();
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
