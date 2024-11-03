import type {
	Client,
	ModelRepository as GhModelRepository,
	QuerySearch,
} from "squire-github";
import { logger } from "toolbox";
import type { Store } from "./interfaces";
import type {
	ModelPullRequest,
	ModelRepository,
	ModelSecurity,
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

		async syncProducts(): Promise<Error[]> {
			const bulkInsertErrors: Error[] = [];

			const topics = await store.getAllProductTags();
			if (topics.error) {
				logger.error({ error: topics.error }, "error getting product tags");
				bulkInsertErrors.push(topics.error);

				return bulkInsertErrors;
			}

			if (!topics.data) {
				logger.warn("no topics found, finishing sync");
				return bulkInsertErrors;
			}

			for (const topic of topics.data) {
				const insertErrors: Error[] = await this.ingestRepoByTopic(topic);

				bulkInsertErrors.push(...insertErrors);
			}

			return bulkInsertErrors;
		},
		async ingestRepoByTopic(topic: string) {
			logger.debug({ topic }, "ingesting data by topic");
			const resp = await client.searchRepos({ topics: [topic] });

			const { repos, security, pullRequests } = generateModels(resp, topic);

			logger.debug(
				{ totalRepos: repos.length },
				"Inserting repos, pull requests, and security vulnerabilities",
			);
			const insertErrors: Error[] = await bulkInsert(store, {
				repos,
				security,
				pullRequests,
			});

			return insertErrors;
		},
	};
}

interface BulkInsert {
	repos: ModelRepository[];
	security: ModelSecurity[];
	pullRequests: ModelPullRequest[];
}

async function bulkInsert(
	store: Store,
	{ repos, security, pullRequests }: BulkInsert,
): Promise<Error[]> {
	const insertErrors: Error[] = [];

	logger.debug({ totalRepos: repos.length }, "Inserting repos");
	const repoResult = await store.bulkInsertRepos(repos);
	if (repoResult.error) {
		logger.error({ error: repoResult.error }, "error inserting into store");
		insertErrors.push(repoResult.error);

		return insertErrors;
	}

	logger.debug(
		{ totalSecurityVulnerabilities: security.length },
		"Inserting security vulnerabilities",
	);
	const securityResult = await store.bulkInsertSecVulnerabilities(security);

	if (securityResult.error) {
		logger.error({ error: securityResult.error }, "error inserting into store");
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
}

function generateModels(
	query: QuerySearch<GhModelRepository>,
	topic: string,
): BulkInsert {
	const repos: ModelRepository[] = [];
	const securities: ModelSecurity[] = [];
	const pullRequests: ModelPullRequest[] = [];

	for (const node of query.data.search.edges) {
		const repo = generateRepoFromGhModel(
			node.node,
			node.node.owner.login,
			topic,
		);
		repos.push(repo);

		const security = generateSecurityFromGhModel(node.node, repo.id);
		securities.push(...security);

		const pr = generatePullRequestFromGhModel(
			node.node,
			repo.id,
			repo.owner,
			repo.name,
		);
		pullRequests.push(...pr);
	}

	return {
		repos,
		security: securities,
		pullRequests,
	};
}
