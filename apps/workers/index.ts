import { Database, OPEN_READWRITE } from "duckdb-async";
import { initRepository, initWorker } from "squire";
import { initClient } from "squire-github";
import { logger } from "toolbox";
import cron from "node-cron";
import { loadConfig } from "./src/env";

const config = loadConfig();

const db = await Database.create(config.dbFilePath, OPEN_READWRITE);

const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

const repo = initRepository(db);
const worker = initWorker(client, repo);

const err = await worker.init();
if (err) {
	logger.error({ error: err }, "Error initialising service");
	process.exit(1);
}

cron.schedule("*/5 * * * *", async () => {
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

db.close();

logger.info("Synced repos");
