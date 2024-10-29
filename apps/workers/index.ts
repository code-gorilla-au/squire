import { Database, OPEN_READWRITE } from "duckdb-async";
import { initRepository, initWorker } from "squire";
import { initClient } from "squire-github";
import { logger } from "toolbox";
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

logger.info("syncing repos");
const syncErrors: Error[] = [];

for (const topic of config.ghRepoTopics) {
	logger.info({ topic }, "Syncing repos by topic");
	const err = await worker.ingestRepoByTopic(topic);
	if (err.length) {
		syncErrors.push(...err);
	}
}

db.close();

logger.info("Synced repos");
