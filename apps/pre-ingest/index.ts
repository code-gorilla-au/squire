import { initDB } from "database";
import type { Level } from "pino";
import { ProductRepository, ProductService } from "products";
import { ProductExistsError } from "products/src/errors";
import { initClient } from "squire-github";
import { serverLogger } from "toolbox";
import { loadConfig } from "./src/env";

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

const errList: Error[] = [];
for (const topic of config.TOPICS_TO_INGEST) {
	try {
		logger.debug("Creating product for topic", topic);
		await service.createProduct(topic, [topic]);
	} catch (error) {
		const err = error as Error;
		if (err instanceof ProductExistsError) {
			logger.warn({ topic }, "Product already exists, skipping...");
			continue;
		}

		logger.error({ error: err.message }, "Error creating product");
		errList.push(err);
	}
}

if (errList.length > 0) {
	const totalErrs = JSON.stringify(errList);
	logger.error({ totalErrs }, "Error creating products");

	throw new Error("Error creating products");
}

logger.info("Products created, syncing...");
const syncErrs = await service.syncProducts();
if (syncErrs.length > 0) {
	const totalErrs = JSON.stringify(syncErrs);
	logger.error({ totalErrs }, "Error syncing products");

	throw new Error("Error syncing products");
}

await db.close();
