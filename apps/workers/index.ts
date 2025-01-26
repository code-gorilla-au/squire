import { ProductRepository, ProductService } from "../../packages/products";
import { initClient } from "squire-github";
import { logger } from "toolbox";
import { loadConfig } from "./src/env";
import { initDB } from "database";

const config = loadConfig();

const db = await initDB(config.dbFilePath);

const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

const repo = new ProductRepository(db, logger);
const service = new ProductService(repo, logger, client);

for (const topic of config.ghRepoTopics) {
	try {
		logger.info({ topic }, "Adding topic");
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
