import { env } from "bun";
import { initService, initRepository } from "squire";
import { initClient } from "squire-github";
import { Database, OPEN_READWRITE } from "duckdb-async";
import { logger } from "toolbox";

const ghToken = env.GH_TOKEN ?? "";
const dbFilePath = env.DB_FILE_PATH ?? ":memory:";

const db = await Database.create(dbFilePath, OPEN_READWRITE);

const client = initClient({
	ghToken,
	defaultOwner: "code-gorilla-au",
});

const repo = initRepository(db);
const service = initService(client, repo);

const err = await service.init();
if (err) {
	logger.error({ error: err }, "Error initialising service");
	process.exit(1);
}

const resp = await service.syncReposByTopics("cli");

logger.info({ resp }, "Synced repos");
