import type { Client } from "squire-github";
import type { Database } from "duckdb-async";
import {
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";

export function initService(client: Client, db: Database) {
	return {
		async syncReposByTopics(topic: string) {
			const resp = await client.searchRepos({ topics: [topic] });

			const repos = [];
			const securities = [];

			for (const node of resp.data.search.edges) {
				const repo = generateRepoFromGhModel(node.node, topic);
				repos.push(repo);

				const security = generateSecurityFromGhModel(node.node, repo.id);
				securities.push(security);
			}

			console.log(repos);
			console.log(securities);
		},
	};
}
