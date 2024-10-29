import type {
	Client,
	QuerySearch,
	ModelRepository as GhModelRepository,
} from "squire-github";
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

		async syncProducts() {
			const tags = await store.getAllProductTags();
			if (tags.error || !tags.data) {
				logger.error({ error: tags.error }, "error getting product tags");
				return tags.error;
			}

			const resp = await client.searchRepos({ topics: [...tags.data] });

			const { repos, security, pullRequests } = generateModels(resp, topic);

			const insertErrors: Error[] = await bulkInsert(store, {
				repos,
				security,
				pullRequests,
			});

			return insertErrors;
		},
		async ingestRepoByTopic(topic: string) {
			const resp = await client.searchRepos({ topics: [topic] });

			const { repos, security, pullRequests } = generateModels(resp, topic);

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
