import { logger } from "toolbox";
import { db } from "$lib/database";
import { loadConfig } from "$lib/env";
import { initRepository, initService, initWorker } from "squire";
import { initClient } from "squire-github";
import cron from "node-cron";

const config = loadConfig();

const repo = initRepository(db);
export const service = initService(repo);

const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

export const worker = initWorker(client, repo);

await worker.init();

cron.schedule("*/1 * * * *", async () => {
	logger.info("syncing repos");
	const blueprintErr = await worker.ingestRepoByTopic("blueprint");
	if (blueprintErr.length) {
		logger.error({ blueprintErr }, "Error syncing repos");
		process.exit(1);
	}

	const imErr = await worker.ingestRepoByTopic("inventory-management");
	if (imErr.length) {
		logger.error({ imErr }, "Error syncing repos");
		process.exit(1);
	}

	logger.info("syncing complete");
});
