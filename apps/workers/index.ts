import { env } from "bun";
import { initClient } from "squire-github";

const ghToken = env.GH_TOKEN ?? "";

const client = initClient({
	ghToken,
	defaultOwner: "code-gorilla-au",
});

const resp = await client.searchRepos({ topics: ["cli"] });

console.log(resp);
