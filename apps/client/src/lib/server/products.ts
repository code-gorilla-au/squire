import { initDB } from "database";
import { loadConfig } from "$lib/server/env";
import cron from "node-cron";
import { ProductRepository, ProductService } from "products";
import { initClient } from "squire-github";
import { logger } from "toolbox";

const config = loadConfig();
const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

const db = await initDB(config.dbFilePath);
const repo = new ProductRepository(db, logger);
await repo.initTables();

export const service = new ProductService(repo, logger, client);

process.on("sveltekit:shutdown", async () => {
	logger.debug("shutting down");
	await db.close();
});

cron.schedule("*/3 * * * *", async () => {
	logger.info("fetching dashboard data");
	const errors = await service.syncProducts();
	if (errors.length) {
		logger.error({ errors }, "errors fetching dashboard data");
	}
	logger.info("dashboard data fetched");
});
