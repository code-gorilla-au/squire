import type { Client } from "squire-github";
import {
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";
import type { ModelRepository, ModelSecurity, SecurityDto } from "./models";
import type { Store } from "./interfaces";
import { logger } from "toolbox";

export function initWorker(client: Client, store: Store) {
	return {
		async init() {
			const result = await store.initTables();
			return result.error;
		},
		async ingestRepoByTopic(topic: string) {
			const resp = await client.searchRepos({ topics: [topic] });

			const repos: ModelRepository[] = [];
			const securities: ModelSecurity[] = [];

			for (const node of resp.data.search.edges) {
				const repo = generateRepoFromGhModel(
					node.node,
					node.node.owner.login,
					topic,
				);
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
				{ totalSecurityVulnerabilities: securities.length },
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
		async getOpenSecurityVulnerabilitiesByRepoId(repoId: string) {
			const result = await store.getOpenSecByRepoId(repoId);

			if (result.error) {
				logger.error({ error: result.error }, "Error getting open security");
				throw new Error("error getting security vulnerabilities");
			}

			return result.data as SecurityDto[];
		},
	};
}
