import type { Client } from "squire-github";
import type { Database } from "duckdb-async";
import {
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";
import type { ModelRepository, ModelSecurity, Store } from "./types";
import { logger } from "toolbox";

export function initService(client: Client, store: Store) {
	return {
		async syncReposByTopics(topic: string) {
			const resp = await client.searchRepos({ topics: [topic] });

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
