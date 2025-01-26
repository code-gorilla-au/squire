import { db } from "$lib/server/database";
import { loadConfig } from "$lib/server/env";
import cron from "node-cron";
import { ProductRepository, ProductService, initWorker } from "products";
import { initClient } from "squire-github";
import { logger } from "toolbox";

const config = loadConfig();

const repo = new ProductRepository(db, logger);
export const service = new ProductService(repo, logger);

const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

export const worker = initWorker(client, repo);

await worker.init();

process.on("sveltekit:shutdown", async () => {
	logger.debug("shutting down");
	await db.close();
});

cron.schedule("*/1 * * * *", async () => {
	logger.info("fetching dashboard data");
	const errors = await worker.syncProducts();
	if (errors.length) {
		logger.error({ errors }, "errors fetching dashboard data");
	}
	logger.info("dashboard data fetched");
});
