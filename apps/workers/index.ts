import { env } from "bun";
import { initService } from "squire";
import { initClient } from "squire-github";

const ghToken = env.GH_TOKEN ?? "";

const client = initClient({
	ghToken,
	defaultOwner: "code-gorilla-au",
});
const service = initService(client);

const resp = await service.syncReposByTopics("cli");

console.log(resp);
