import { ProductRepository, ProductService } from "../../packages/products";
import { initClient } from "squire-github";
import { logger } from "toolbox";
import { loadConfig } from "./src/env";
import { initDB } from "database";

logger.debug("Starting worker");
const config = loadConfig();

logger.debug("Initializing DB");
const db = await initDB(config.dbFilePath);

logger.debug("Initializing client");
const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

logger.debug("Initializing services");
const repo = new ProductRepository(db, logger);
const service = new ProductService(repo, logger, client);

logger.info("Adding products");
for (const topic of config.ghRepoTopics) {
	try {
		logger.info({ topic }, "Adding product");
		await service.createProduct(topic, [topic]);
	} catch (error) {
		const err = error as Error;
		logger.error({ error: err.message }, "Error adding topic");
		process.exit(1);
	}
}

logger.info("syncing repos");
const syncErrors: Error[] = [];

try {
	await service.syncProducts();
} catch (error) {
	const err = error as Error;
	logger.error({ error: err.message }, "Error syncing repos");
	syncErrors.push(err);
}

db.close();

logger.info("Synced repos");
