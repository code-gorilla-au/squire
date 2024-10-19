import { initService, initRepository } from "squire";
import { initClient } from "squire-github";
import { Database, OPEN_READWRITE } from "duckdb-async";
import { logger } from "toolbox";
import { loadConfig } from "./src/env";

const config = loadConfig();

const db = await Database.create(config.dbFilePath, OPEN_READWRITE);

const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

const repo = initRepository(db);
const service = initService(client, repo);

const err = await service.init();
if (err) {
	logger.error({ error: err }, "Error initialising service");
	process.exit(1);
}

const resp = await service.syncReposByTopics("cli");
if (resp.length) {
	logger.error({ resp }, "Error syncing repos");
	process.exit(1);
}

logger.info({ resp }, "Synced repos");
