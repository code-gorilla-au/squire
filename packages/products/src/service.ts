import type { Store } from "./interfaces";
import {
	modelProduct,
	productDto,
	pullRequestInsightsDto,
	securityAdvisoryDto,
	securityAdvisoryInsightsDto,
	type InsightsDto,
	type ModelPullRequest,
	type ModelRepository,
	type ModelSecurity,
	type ProductDto,
	type PullRequestDto,
	type RepositoryDto,
	type SecurityAdvisoryDto,
} from "./models";
import { severityWeighting } from "./transforms";
import type { Logger } from "pino";
import {
	generatePullRequestFromGhModel,
	generateRepoFromGhModel,
	generateSecurityFromGhModel,
} from "./transforms";
import type {
	Client,
	Repository as GhModelRepository,
	QuerySearch,
} from "squire-github";

export class ProductService {
	private store: Store;
	private log: Logger;
	private ghClient: Client;

	constructor(store: Store, log: Logger, ghClient: Client) {
		this.store = store;
		this.log = log.child({
			package: "products",
			service: "ProductService",
		});
		this.ghClient = ghClient;
	}

	async createProduct(name: string, tags: string[]): Promise<void> {
		const result = await this.store.insertProduct(name, tags);

		if (result.error) {
			this.log.error({ error: result.error.message }, "Error creating product");
			throw result.error;
		}
	}

	async getAllProducts(): Promise<ProductDto[]> {
		const results = await this.store.getAllProducts();

		if (results.error) {
			this.log.error(
				{ error: results.error.message },
				"Error fetching products",
			);
			throw results.error;
		}

		this.log.info({ totalProducts: results.data?.length }, "Fetched products");
		if (!results.data) {
			return [];
		}

		const products: ProductDto[] = [];
		for (const product of results.data) {
			const { error, data } = productDto.safeParse(product);
			if (error) {
				this.log.error({ error: error.message }, "Error parsing product");
				throw error;
			}

			products.push(data);
		}

		return products;
	}

	async getProductById(productId: string): Promise<ProductDto> {
		const result = await this.store.getProductById(productId);

		if (result.error) {
			this.log.error({ error: result.error.message }, "Error fetching product");
			throw new Error("error fetching product");
		}

		const { error, data } = modelProduct.safeParse(result.data);
		if (error) {
			this.log.error({ error: error.message }, "Error parsing product");
			throw error;
		}

		return data;
	}
	async updateProduct(
		productId: string,
		name: string,
		tags: string[],
	): Promise<void> {
		this.log.info({ productId, name, tags }, "Updating product");
		const result = await this.store.updateProduct({
			id: productId,
			name,
			tags,
		});

		if (result.error) {
			this.log.error({ error: result.error }, "Error updating product");
			throw result.error;
		}
		this.log.info({ productId, name, tags }, "Product updated");
	}

	async getAllOpenSecurityAdvisories(): Promise<SecurityAdvisoryDto[]> {
		const results = await this.store.getAllSecurityAdvisory();

		if (results.error) {
			this.log.error(
				{ error: results.error },
				"Error fetching security advisories",
			);
			throw new Error("error fetching security advisories");
		}

		this.log.info(
			{ totalAdvisories: results.data?.length },
			"Fetched security advisories",
		);

		const advisories: SecurityAdvisoryDto[] = [];
		for (const adv of results?.data ?? []) {
			const { error, data } = securityAdvisoryDto.safeParse(adv);
			if (error) {
				this.log.error({ error: error.message }, "Error parsing advisory");
				throw error;
			}

			advisories.push(data);
		}

		return advisories;
	}
	async getOpenSecurityAdvisoryByProductId(
		productId: string,
	): Promise<SecurityAdvisoryDto[]> {
		const results = await this.store.getSecurityAdvisoryByProductId(
			productId,
			10,
		);

		if (results.error) {
			this.log.error(
				{ error: results.error },
				"Error fetching security advisories",
			);
			throw new Error("error fetching security advisories");
		}

		this.log.info(
			{ totalAdvisories: results.data?.length },
			"Fetched security advisories",
		);

		const advisories: SecurityAdvisoryDto[] = [
			...(results.data as SecurityAdvisoryDto[]),
		];

		advisories.sort(orderBySeverityWeight);

		return advisories;
	}
	async getReposByProductId(productId: string): Promise<RepositoryDto[]> {
		const results = await this.store.getReposByProductId(productId);

		if (results.error) {
			this.log.error({ error: results.error }, "Error fetching repos");
			throw new Error("error fetching repos");
		}

		this.log.info({ totalRepos: results.data?.length }, "Fetched repos");

		const repos: RepositoryDto[] = [...(results.data as RepositoryDto[])];

		return repos;
	}
	async removeProduct(productId: string): Promise<void> {
		const result = await this.store.deleteProduct(productId);

		if (result.error) {
			this.log.error({ error: result.error }, "Error deleting product");
			throw new Error("error deleting product");
		}

		this.log.info({ productId }, "Product deleted");
	}
	async getAllOpenPullRequests(): Promise<PullRequestDto[]> {
		const results = await this.store.getOpenPullRequests();
		if (results.error) {
			this.log.error({ error: results.error }, "Error fetching PRs");
			throw new Error("error fetching PRs");
		}

		this.log.info({ totalPRs: results.data?.length }, "Fetched PRs");

		const prs: PullRequestDto[] = [...(results.data as PullRequestDto[])];
		return prs;
	}
	async getPullRequestsByProductId(
		productId: string,
	): Promise<PullRequestDto[]> {
		const results = await this.store.getOpenPullRequestsByProductId(productId);

		if (results.error) {
			this.log.error({ error: results.error }, "Error fetching PRs");
			throw new Error("error fetching PRs");
		}

		this.log.info({ totalPRs: results.data?.length }, "Fetched PRs");

		const prs: PullRequestDto[] = [...(results.data as PullRequestDto[])];

		return prs;
	}
	async getInsights(): Promise<InsightsDto> {
		const pullRequestResults = await this.store.getPullRequestInsights();

		if (pullRequestResults.error) {
			this.log.error(
				{ error: pullRequestResults.error },
				"Error fetching PR insights",
			);
			throw new Error("error fetching PR insights");
		}

		const pullRequests = pullRequestInsightsDto.parse(pullRequestResults.data);

		const securityResults = await this.store.getSecurityAdvisoryInsights();

		if (securityResults.error) {
			this.log.error(
				{ error: securityResults.error },
				"Error fetching security insights",
			);
			throw new Error("error fetching security insights");
		}

		const securityAdvisories = securityAdvisoryInsightsDto.parse(
			securityResults.data,
		);

		return { pullRequests, securityAdvisories };
	}

	async getInsightsByProduct(productId: string): Promise<InsightsDto> {
		const results = await this.store.getPullRequestInsightsByProduct(productId);

		if (results.error) {
			this.log.error({ error: results.error }, "Error fetching PR insights");
			throw new Error("error fetching PR insights");
		}

		const pullRequests = pullRequestInsightsDto.parse(results.data);

		const securityResults =
			await this.store.getSecurityAdvisoryInsightsByProduct(productId);

		if (securityResults.error) {
			this.log.error(
				{ error: securityResults.error },
				"Error fetching security insights",
			);
			throw new Error("error fetching security insights");
		}

		const securityAdvisories = securityAdvisoryInsightsDto.parse(
			securityResults.data,
		);

		return { pullRequests, securityAdvisories };
	}

	async syncProducts(): Promise<Error[]> {
		const bulkInsertErrors: Error[] = [];

		const topics = await this.store.getAllProductTags();
		if (topics.error) {
			this.log.error({ error: topics.error }, "error getting product tags");
			bulkInsertErrors.push(topics.error);

			return bulkInsertErrors;
		}

		if (!topics.data) {
			this.log.warn("no topics found, finishing sync");
			return bulkInsertErrors;
		}

		for (const topic of topics.data) {
			const insertErrors: Error[] = await this.ingestDataByTopic(topic);

			bulkInsertErrors.push(...insertErrors);
		}

		return bulkInsertErrors;
	}

	private async ingestDataByTopic(topic: string): Promise<Error[]> {
		this.log.debug({ topic }, "ingesting data by topic");
		const resp = await this.ghClient.searchRepos({ topics: [topic] });

		const { repos, security, pullRequests } = generateModels(resp, topic);

		this.log.debug(
			{ totalRepos: repos.length },
			"Inserting repos, pull requests, and security vulnerabilities",
		);
		const insertErrors: Error[] = await this.bulkInsert({
			repos,
			security,
			pullRequests,
		});

		return insertErrors;
	}

	private async bulkInsert({
		repos,
		security,
		pullRequests,
	}: BulkInsertParams): Promise<Error[]> {
		const insertErrors: Error[] = [];

		this.log.info({ totalRepos: repos.length }, "Inserting repos");
		const repoResult = await this.store.bulkInsertRepos(repos);
		if (repoResult.error) {
			this.log.error({ error: repoResult.error }, "error inserting into store");
			insertErrors.push(repoResult.error);

			return insertErrors;
		}

		this.log.debug(
			{ totalSecurityVulnerabilities: security.length },
			"Inserting security vulnerabilities",
		);
		const securityResult =
			await this.store.bulkInsertSecVulnerabilities(security);

		if (securityResult.error) {
			this.log.error(
				{ error: securityResult.error },
				"error inserting into store",
			);
			insertErrors.push(securityResult.error);
		}

		this.log.debug(
			{ totalPullRequests: pullRequests.length },
			"Inserting pull requests",
		);

		const prResult = await this.store.bulkInsertPullRequests(pullRequests);
		if (prResult.error) {
			this.log.error({ error: prResult.error }, "error inserting into store");
			insertErrors.push(prResult.error);
		}

		return insertErrors;
	}
}

/**
 * order security advisories by severity
 * @param prev previous security advisory
 * @param next next security advisory
 */
function orderBySeverityWeight(
	prev: SecurityAdvisoryDto,
	next: SecurityAdvisoryDto,
) {
	const prevSec = severityWeighting(prev.severity);
	const nextSec = severityWeighting(next.severity);

	if (prevSec < nextSec) {
		return -1;
	}

	return 1;
}

interface BulkInsertParams {
	repos: ModelRepository[];
	security: ModelSecurity[];
	pullRequests: ModelPullRequest[];
}

function generateModels(
	query: QuerySearch<GhModelRepository>,
	topic: string,
): BulkInsertParams {
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

		const security = generateSecurityFromGhModel(node.node, repo.name);
		securities.push(...security);

		const pr = generatePullRequestFromGhModel(
			node.node,
			repo.name,
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
