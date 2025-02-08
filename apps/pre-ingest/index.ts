import { initDB } from "database";
import type { Level } from "pino";
import { ProductRepository, ProductService } from "products";
import { initClient } from "squire-github";
import { serverLogger } from "toolbox";
import { loadConfig } from "./src/env";
import { IngestService } from "./src/ingest";

const config = loadConfig();
const logger = serverLogger(config.VITE_LOG_LEVEL as Level);

const ghClient = initClient({
	ghToken: config.VITE_GH_TOKEN,
	defaultOwner: config.VITE_GH_OWNER,
});

const db = await initDB(config.VITE_DB_FILE_PATH);
const repo = new ProductRepository(db, logger);
const service = new ProductService(repo, logger, ghClient);

logger.info("initializing tables...");

await repo.initTables();

logger.info("creating products...");

const ingestService = new IngestService(logger, service);

await ingestService.ingest(config.TOPICS_TO_INGEST);
