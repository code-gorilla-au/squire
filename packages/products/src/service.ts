import type { Store } from "./interfaces";
import {
	modelProduct,
	productDto,
	pullRequestInsightsDto,
	securityAdvisoryInsightsDto,
	type InsightsDto,
	type ProductDto,
	type PullRequestDto,
	type RepositoryDto,
	type SecurityAdvisoryDto,
} from "./models";
import { severityWeighting } from "./transforms";
import type { Logger } from "pino";

export class ProductService {
	private store: Store;
	private log: Logger;

	constructor(store: Store, log: Logger) {
		this.store = store;
		this.log = log.child({
			package: "products",
			service: "ProductService",
		});
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
			throw new Error("error updating product");
		}
		this.log.info({ productId, name, tags }, "Product updated");
	}
	async getAllSecurityAdvisories(): Promise<SecurityAdvisoryDto[]> {
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

		const advisories: SecurityAdvisoryDto[] = [
			...(results.data as SecurityAdvisoryDto[]),
		];

		return advisories;
	}
	async getSecurityAdvisoryByProductId(
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
