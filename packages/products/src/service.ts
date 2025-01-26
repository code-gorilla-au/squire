import { logger } from "toolbox";
import type { Store } from "./interfaces";
import {
	pullRequestInsightsDto,
	securityAdvisoryInsightsDto,
	type InsightsDto,
	type ProductDto,
	type PullRequestDto,
	type RepositoryDto,
	type SecurityAdvisoryDto,
} from "./models";
import { severityWeighting } from "./transforms";

export function initService(store: Store) {
	return {
		async createProduct(name: string, tags: string[]): Promise<void> {
			const result = await store.insertProduct(name, tags);

			if (result.error) {
				logger.error({ error: result.error }, "Error creating product");
				throw new Error("error creating product");
			}
		},
		async getAllProducts(): Promise<ProductDto[]> {
			const results = await store.getAllProducts();

			if (results.error) {
				logger.error({ error: results.error }, "Error fetching products");
				throw new Error("error fetching products");
			}

			logger.info({ totalProducts: results.data?.length }, "Fetched products");

			const products: ProductDto[] = [...(results.data as ProductDto[])];

			return products;
		},
		async getProductById(productId: string): Promise<ProductDto> {
			const result = await store.getProductById(productId);

			if (result.error) {
				logger.error({ error: result.error }, "Error fetching product");
				throw new Error("error fetching product");
			}

			const product = result.data as ProductDto;

			return product;
		},
		async updateProduct(
			productId: string,
			name: string,
			tags: string[],
		): Promise<void> {
			logger.info({ productId, name, tags }, "Updating product");
			const result = await store.updateProduct({
				id: productId,
				name,
				tags,
			});

			if (result.error) {
				logger.error({ error: result.error }, "Error updating product");
				throw new Error("error updating product");
			}
			logger.info({ productId, name, tags }, "Product updated");
		},
		async getAllSecurityAdvisories(): Promise<SecurityAdvisoryDto[]> {
			const results = await store.getAllSecurityAdvisory();

			if (results.error) {
				logger.error(
					{ error: results.error },
					"Error fetching security advisories",
				);
				throw new Error("error fetching security advisories");
			}

			logger.info(
				{ totalAdvisories: results.data?.length },
				"Fetched security advisories",
			);

			const advisories: SecurityAdvisoryDto[] = [
				...(results.data as SecurityAdvisoryDto[]),
			];

			return advisories;
		},
		async getSecurityAdvisoryByProductId(
			productId: string,
		): Promise<SecurityAdvisoryDto[]> {
			const results = await store.getSecurityAdvisoryByProductId(productId, 10);

			if (results.error) {
				logger.error(
					{ error: results.error },
					"Error fetching security advisories",
				);
				throw new Error("error fetching security advisories");
			}

			logger.info(
				{ totalAdvisories: results.data?.length },
				"Fetched security advisories",
			);

			const advisories: SecurityAdvisoryDto[] = [
				...(results.data as SecurityAdvisoryDto[]),
			];

			advisories.sort(orderBySeverityWeight);

			return advisories;
		},
		async getReposByProductId(productId: string): Promise<RepositoryDto[]> {
			const results = await store.getReposByProductId(productId);

			if (results.error) {
				logger.error({ error: results.error }, "Error fetching repos");
				throw new Error("error fetching repos");
			}

			logger.info({ totalRepos: results.data?.length }, "Fetched repos");

			const repos: RepositoryDto[] = [...(results.data as RepositoryDto[])];

			return repos;
		},
		async removeProduct(productId: string): Promise<void> {
			const result = await store.deleteProduct(productId);

			if (result.error) {
				logger.error({ error: result.error }, "Error deleting product");
				throw new Error("error deleting product");
			}

			logger.info({ productId }, "Product deleted");
		},
		async getAllOpenPullRequests(): Promise<PullRequestDto[]> {
			const results = await store.getOpenPullRequests();
			if (results.error) {
				logger.error({ error: results.error }, "Error fetching PRs");
				throw new Error("error fetching PRs");
			}

			logger.info({ totalPRs: results.data?.length }, "Fetched PRs");

			const prs: PullRequestDto[] = [...(results.data as PullRequestDto[])];
			return prs;
		},
		async getPullRequestsByProductId(
			productId: string,
		): Promise<PullRequestDto[]> {
			const results = await store.getOpenPullRequestsByProductId(productId);

			if (results.error) {
				logger.error({ error: results.error }, "Error fetching PRs");
				throw new Error("error fetching PRs");
			}

			logger.info({ totalPRs: results.data?.length }, "Fetched PRs");

			const prs: PullRequestDto[] = [...(results.data as PullRequestDto[])];

			return prs;
		},
		async getInsights(): Promise<InsightsDto> {
			const pullRequestResults = await store.getPullRequestInsights();

			if (pullRequestResults.error) {
				logger.error(
					{ error: pullRequestResults.error },
					"Error fetching PR insights",
				);
				throw new Error("error fetching PR insights");
			}

			const pullRequests = pullRequestInsightsDto.parse(
				pullRequestResults.data,
			);

			const securityResults = await store.getSecurityAdvisoryInsights();

			if (securityResults.error) {
				logger.error(
					{ error: securityResults.error },
					"Error fetching security insights",
				);
				throw new Error("error fetching security insights");
			}

			const securityAdvisories = securityAdvisoryInsightsDto.parse(
				securityResults.data,
			);

			return { pullRequests, securityAdvisories };
		},

		async getInsightsByProduct(productId: string): Promise<InsightsDto> {
			const results = await store.getPullRequestInsightsByProduct(productId);

			if (results.error) {
				logger.error({ error: results.error }, "Error fetching PR insights");
				throw new Error("error fetching PR insights");
			}

			const pullRequests = pullRequestInsightsDto.parse(results.data);

			const securityResults =
				await store.getSecurityAdvisoryInsightsByProduct(productId);

			if (securityResults.error) {
				logger.error(
					{ error: securityResults.error },
					"Error fetching security insights",
				);
				throw new Error("error fetching security insights");
			}

			const securityAdvisories = securityAdvisoryInsightsDto.parse(
				securityResults.data,
			);

			return { pullRequests, securityAdvisories };
		},
	};
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
