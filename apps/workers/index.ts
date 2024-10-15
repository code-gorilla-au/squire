import { env } from "bun";
import { initService } from "squire";
import { initClient } from "squire-github";
import { Database, OPEN_READWRITE } from "duckdb-async";

const ghToken = env.GH_TOKEN ?? "";
const dbFilePath = env.DB_FILE_PATH ?? ":memory:";

const db = await Database.create(dbFilePath, OPEN_READWRITE);

const client = initClient({
	ghToken,
	defaultOwner: "code-gorilla-au",
});
const service = initService(client, db);

const resp = await service.syncReposByTopics("cli");

console.log(resp);
