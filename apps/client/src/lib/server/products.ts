import { db } from "$lib/database";
import { loadConfig } from "$lib/env";
import cron from "node-cron";
import { initRepository, initService, initWorker } from "squire";
import { initClient } from "squire-github";
import { logger } from "toolbox";

const config = loadConfig();

const repo = initRepository(db);
export const service = initService(repo);

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
	logger.info("syncing repos");
	const errors = await worker.syncProducts();
	if (errors.length) {
		logger.error({ errors }, "errors syncing repos");
		process.exit(1);
	}
	logger.info("syncing complete");
});
