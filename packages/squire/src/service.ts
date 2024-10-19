import type { Client } from "squire-github";
import {
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";
import type { ModelRepository, ModelSecurity, Store } from "./types";
import { logger } from "toolbox";

export function initService(client: Client, store: Store) {
	return {
		async init() {
			const result = await store.initTables();
			return result.error;
		},
		async syncReposByTopics(topic: string) {
			const resp = await client.searchRepos({ topics: [topic] });
			console.log(resp, null, 2);

			const repos: ModelRepository[] = [];
			const securities: ModelSecurity[] = [];

			for (const node of resp.data.search.edges) {
				const repo = generateRepoFromGhModel(node.node, topic);
				repos.push(repo);

				const security = generateSecurityFromGhModel(node.node, repo.id);
				securities.push(...security);
			}

			const insertErrors: Error[] = [];

			logger.debug({ totalRepos: repos.length }, "Inserting repos");
			const repoResult = await store.bulkInsertRepos(repos);
			if (repoResult.error) {
				logger.error({ error: repoResult.error }, "error inserting into store");
				insertErrors.push(repoResult.error);

				return insertErrors;
			}

			logger.debug(
				{ totalRepos: securities.length },
				"Inserting security vulnerabilities",
			);
			const securityResult =
				await store.bulkInsertSecVulnerabilities(securities);

			if (securityResult.error) {
				logger.error(
					{ error: securityResult.error },
					"error inserting into store",
				);
				insertErrors.push(securityResult.error);
			}

			return insertErrors;
		},
	};
}
