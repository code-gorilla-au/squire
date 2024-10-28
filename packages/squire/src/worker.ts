import type { Client } from "squire-github";
import { logger } from "toolbox";
import type { Store } from "./interfaces";
import type {
	ModelRepository,
	ModelSecurity,
	ModelPullRequest,
} from "./models";
import {
	generatePullRequestFromGhModel,
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";

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
			const pullRequests: ModelPullRequest[] = [];

			for (const node of resp.data.search.edges) {
				const repo = generateRepoFromGhModel(
					node.node,
					node.node.owner.login,
					topic,
				);
				repos.push(repo);

				const security = generateSecurityFromGhModel(node.node, repo.id);
				securities.push(...security);

				const pr = generatePullRequestFromGhModel(node.node, repo.id);
				pullRequests.push(...pr);
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

			logger.debug(
				{ totalPullRequests: pullRequests.length },
				"Inserting pull requests",
			);

			const prResult = await store.bulkInsertPullRequests(pullRequests);
			if (prResult.error) {
				logger.error({ error: prResult.error }, "error inserting into store");
				insertErrors.push(prResult.error);
			}

			return insertErrors;
		},
	};
}
