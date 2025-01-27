import type { Database, TableData } from "duckdb-async";
import {
	modelProduct,
	modelPullRequest,
	modelPullRequestInsights,
	modelRepository,
	modelSecurity,
	modelSecurityAdvisory,
	modelSecurityAdvisoryInsights,
	type ModelProduct,
	type ModelPullRequest,
	type ModelPullRequestInsights,
	type ModelRepository,
	type ModelSecurity,
	type ModelSecurityAdvisory,
	type ModelSecurityAdvisoryInsights,
	type RepositoryDto,
	type StoreActionResult,
} from "../models";

import {
	queryGetPullRequestInsights,
	queryGetPullRequestInsightsByProduct,
	queryGetSecurityAdvisoryInsights,
	queryGetSecurityAdvisoryInsightsByProduct,
} from "./insights";
import {
	transformToPullRequestInsights,
	transformToSecurityAdvisoryInsights,
} from "../transforms";
import type { Logger } from "pino";
import { ProductExistsError, ProductNotFoundError } from "../errors";

export const queryCreateRepoTable = `
    CREATE TABLE IF NOT EXISTS repositories (
        id uuid PRIMARY KEY,
        name VARCHAR UNIQUE,
        url VARCHAR,
        topic VARCHAR,
        owner VARCHAR,
        createdAt TIMESTAMP WITH TIME ZONE,
        updatedAt TIMESTAMP WITH TIME ZONE
    );
`;

export const queryCreateSecurityTable = `
    CREATE TABLE IF NOT EXISTS securities (
        id uuid PRIMARY KEY,
		externalId VARCHAR UNIQUE,
        repositoryName string,
        packageName VARCHAR,
        state VARCHAR,
        severity VARCHAR,
        patchedVersion VARCHAR,
        createdAt TIMESTAMP WITH TIME ZONE,
        updatedAt TIMESTAMP WITH TIME ZONE
    );
`;

export const queryCreateProductsTable = `
	CREATE TABLE IF NOT EXISTS products (
		id uuid,
		name VARCHAR,
		tags VARCHAR[],
		createdAt TIMESTAMP WITH TIME ZONE,
		updatedAt TIMESTAMP WITH TIME ZONE
	);
`;

export const queryCreateTablePullRequests = `
	CREATE TABLE IF NOT EXISTS pull_requests (
		id uuid PRIMARY KEY,
		externalId VARCHAR UNIQUE,
		title VARCHAR,
		repositoryName string,
		url VARCHAR,
		state VARCHAR,
		author VARCHAR,
		mergedAt TIMESTAMP WITH TIME ZONE,
		createdAt TIMESTAMP WITH TIME ZONE,
		updatedAt TIMESTAMP WITH TIME ZONE
	);
`;

export const queryInsertRepo = `
    INSERT INTO repositories (
        id,
        name,
        url,
        topic,
		owner,
        createdAt,
        updatedAt
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
		$5,
        now(),
        now()
    ) ON CONFLICT DO NOTHING;
`;

export const queryInsertSecurity = `
    INSERT INTO securities (
        id,
		externalId,
        repositoryName,
        packageName,
        state,
        severity,
        patchedVersion,
        createdAt,
        updatedAt
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
		$7,
        $8,
		$9
    ) ON CONFLICT (externalId) DO UPDATE SET state = EXCLUDED.state, 
	 	severity = EXCLUDED.severity, 
		patchedVersion = EXCLUDED.patchedVersion, 
		updatedAt = EXCLUDED.updatedAt;
`;

const queryGetAllSecurityAdvisoryByProduct = `
	SELECT sec.id, 
		sec.externalId, 
		sec.packageName,
		sec.state,
		sec.patchedVersion,
		sec.severity,
		sec.createdAt,
		sec.updatedAt, 
		repo.owner as repoOwner, 
		repo.name as repoName,
		repo.url as repoUrl
	FROM securities sec
	JOIN repositories repo ON sec.repositoryName = repo.name
	JOIN products prod ON repo.topic IN prod.tags
	WHERE sec.state = 'OPEN'
	AND prod.id = $1
	ORDER BY sec.updatedAt DESC
	LIMIT $2;
`;

const queryGetAllSecurityAdvisory = `
	SELECT sec.id, 
		sec.externalId, 
		sec.packageName,
		sec.state,
		sec.patchedVersion,
		sec.severity,
		sec.createdAt,
		sec.updatedAt, 
		repo.owner as repoOwner, 
		repo.name as repoName,
		repo.url as repoUrl
	FROM securities sec
	JOIN repositories repo ON sec.repositoryName = repo.name
	JOIN products prod ON repo.topic IN prod.tags
	WHERE sec.state = 'OPEN'
	ORDER BY sec.updatedAt DESC
	LIMIT $1;
`;

const queryGetReposByProductId = `
	SELECT r.* FROM repositories r
	left join products as p
	on r.topic in p.tags  
	WHERE p.id = $1;
`;

const queryInsertIntoProducts = `
	INSERT INTO products (
		id,
		name,
		tags,
		createdAt,
		updatedAt
	) VALUES (
		UUID(),
		$1,
		LIST_VALUE($2),
		now(),
		now()
	);
`;

const queryGetAllProducts = `
	SELECT * FROM products;
`;

const queryGetAllProductTags = `
	select distinct unnest(tags) as tag from products;
`;

const queryGetProductById = `
	SELECT * FROM products WHERE id = $1;
`;

const queryDeleteProductById = `
	DELETE FROM products WHERE id = $1;
`;

const queryGetProductByName = `
	SELECT * FROM products WHERE name = $1;
`;

const queryUpdateProductById = `
	UPDATE products SET name = $2, tags = LIST_VALUE($3) WHERE id = $1;
`;

const queryInsertPullRequest = `
	INSERT INTO pull_requests (
		id,
		externalId,
		title,
		repositoryName,
		url,
		state,
		author,
		mergedAt,
		createdAt,
		updatedAt
	) VALUES (
		$1,
		$2,
		$3,
		$4,
		$5,
		$6,
		$7,
		$8,
		$9,
		now()
	) ON CONFLICT (externalId) DO UPDATE SET state = EXCLUDED.state,
	 		mergedAt = EXCLUDED.mergedAt,
			updatedAt = now();
`;

const queryGetOpenPullRequestsByProductId = `
	SELECT 
		pr.*,
		r.owner as repoOwner,
		r.name as repoName
	FROM pull_requests pr
	JOIN repositories r ON pr.repositoryName = r.name
	JOIN products p ON r.topic IN p.tags
	WHERE p.id = $1
	AND pr.state = 'OPEN';
`;

const queryGetOpenPullRequests = `
	SELECT 
		pr.*,
		r.owner as repoOwner,
		r.name as repoName
	FROM pull_requests pr
	JOIN repositories r ON pr.repositoryName = r.name
	JOIN products p ON r.topic IN p.tags
	WHERE pr.state = 'OPEN';
`;

const migrations = [
	queryCreateRepoTable,
	queryCreateSecurityTable,
	queryCreateProductsTable,
	queryCreateTablePullRequests,
];

export class ProductRepository {
	private db: Database;
	private log: Logger;
	constructor(db: Database, logger: Logger) {
		this.db = db;
		this.log = logger.child({
			package: "products",
			service: "ProductRepository",
		});
	}

	async initTables(): Promise<StoreActionResult> {
		try {
			this.log.debug("Creating tables");
			await this.db.run(migrations.join(";"));
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return {
				error: err,
			};
		}
	}

	async bulkInsertRepos(repos: ModelRepository[]): Promise<StoreActionResult> {
		try {
			this.log.debug("Inserting repos into database");
			const stmt = await this.db.prepare(queryInsertRepo);

			for (const repo of repos) {
				const { error, data } = modelRepository.safeParse(repo);
				if (error) {
					this.log.error({ error: error.message }, "error parsing repo");
					return { error };
				}

				await stmt.run(data.id, data.name, data.url, data.topic, data.owner);
			}

			await stmt.finalize();

			this.log.debug("Inserted repos into database");
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return {
				error: err,
			};
		}
	}

	async bulkInsertSecVulnerabilities(
		securities: ModelSecurity[],
	): Promise<StoreActionResult> {
		try {
			this.log.debug(
				{ totalSecurities: securities.length },
				"Inserting securities into database",
			);
			const stmt = await this.db.prepare(queryInsertSecurity);

			for (const security of securities) {
				const { error, data } = modelSecurity.safeParse(security);
				if (error) {
					this.log.error({ error: error.message }, "error parsing security");
					return { error };
				}

				await stmt.run(
					data.id,
					data.externalId,
					data.repositoryName,
					data.packageName,
					data.state,
					data.severity,
					data.patchedVersion,
					data.createdAt,
					data.updatedAt,
				);
			}

			await stmt.finalize();

			this.log.debug("Inserted securities into database");
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return {
				error: err,
			};
		}
	}

	async bulkInsertPullRequests(
		pullRequests: ModelPullRequest[],
	): Promise<StoreActionResult> {
		try {
			this.log.debug(
				{ totalPullRequests: pullRequests.length },
				"Inserting pull requests into database",
			);

			const stmt = await this.db.prepare(queryInsertPullRequest);

			for (const pr of pullRequests) {
				const { error, data } = modelPullRequest.safeParse(pr);
				if (error) {
					this.log.error(
						{ error: error.message },
						"error parsing pull request",
					);
					return { error };
				}

				await stmt.run(
					data.id,
					data.externalId,
					data.title,
					data.repositoryName,
					data.url,
					data.state,
					data.author,
					data.mergedAt,
					data.createdAt,
				);
			}

			await stmt.finalize();

			this.log.debug(
				{ totalPullRequests: pullRequests.length },
				"Inserted pull requests into database",
			);
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message }, "error inserting pull request");

			return {
				error: err,
			};
		}
	}

	async getAllSecurityAdvisory(
		limit = 100,
	): Promise<StoreActionResult<ModelSecurityAdvisory[]>> {
		try {
			const results = await this.db.all(queryGetAllSecurityAdvisory, limit);

			const { error, data } = parseModelSecurityAdvisory(results);

			if (error) {
				this.log.error({ error: error }, "error parsing security advisory");
				return { error: error };
			}

			return Promise.resolve({ data: data });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getSecurityAdvisoryByProductId(
		productId: string,
		limit: number,
	): Promise<StoreActionResult<ModelSecurityAdvisory[]>> {
		try {
			const results = await this.db.all(
				queryGetAllSecurityAdvisoryByProduct,
				productId,
				limit,
			);

			const { error, data } = parseModelSecurityAdvisory(results);

			if (error) {
				this.log.error({ error: error }, "error parsing security advisory");
				return { error: error };
			}

			return Promise.resolve({ data: data });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getReposByProductId(
		productId: string,
	): Promise<StoreActionResult<ModelRepository[]>> {
		try {
			const result = await this.db.all(queryGetReposByProductId, productId);
			return Promise.resolve({ data: result as RepositoryDto[] });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async insertProduct(
		name: string,
		tags: string[],
	): Promise<StoreActionResult> {
		try {
			const exists = await this.getProductByName(name);
			if (exists.data) {
				return Promise.resolve({
					error: new ProductExistsError(name),
				});
			}

			await this.db.run(queryInsertIntoProducts, name, tags);
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getProductById(id: string): Promise<StoreActionResult<ModelProduct>> {
		try {
			const results = await this.db.all(queryGetProductById, id);

			if (results.length > 1) {
				return Promise.resolve({
					error: new Error("Multiple products exists with the same id"),
				});
			}

			if (results.length === 0) {
				return Promise.resolve({
					error: new ProductNotFoundError(id),
				});
			}

			const { error, data } = modelProduct.safeParse(results[0]);
			if (error) {
				const err = error as Error;
				this.log.error({ error: err.message }, "error parsing product");
				return { error };
			}

			return Promise.resolve({ data });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async updateProduct({
		id,
		name,
		tags,
	}: {
		id: string;
		name: string;
		tags: string[];
	}): Promise<StoreActionResult> {
		try {
			const existingProduct = await this.getProductByName(name);

			if (existingProduct.data && existingProduct.data.id !== id) {
				return Promise.resolve({
					error: new ProductExistsError(name),
				});
			}

			await this.db.run(queryUpdateProductById, id, name, tags);
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async deleteProduct(id: string): Promise<StoreActionResult> {
		try {
			await this.db.run(queryDeleteProductById, id);
			return Promise.resolve({ data: null });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	private async getProductByName(
		name: string,
	): Promise<StoreActionResult<ModelProduct>> {
		const results = await this.db.all(queryGetProductByName, name);

		if (results.length === 0) {
			return Promise.resolve({
				error: new ProductNotFoundError(name),
			});
		}

		if (results.length > 1) {
			return Promise.resolve({
				error: new Error("Multiple products exists with the same name"),
			});
		}

		const { error, data } = modelProduct.safeParse(results[0]);
		if (error) {
			this.log.error({ error: error.message }, "error parsing product");
			return { error };
		}

		return Promise.resolve({ data });
	}

	async getAllProductTags(): Promise<StoreActionResult<string[]>> {
		try {
			const result = await this.db.all(queryGetAllProductTags);
			return Promise.resolve({
				data: result.map((r) => r.tag) as string[],
			});
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message }, "could not get all product tags");

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getAllProducts(): Promise<StoreActionResult<ModelProduct[]>> {
		try {
			const results = await this.db.all(queryGetAllProducts);

			const products: ModelProduct[] = [];
			for (const result of results) {
				const { error, data } = modelProduct.safeParse(result);
				if (error) {
					this.log.error({ error: error.message }, "error parsing product");
					return { error };
				}

				products.push(data);
			}

			return Promise.resolve({ data: products });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getOpenPullRequestsByProductId(
		id: string,
	): Promise<StoreActionResult<ModelPullRequest[]>> {
		try {
			const results = await this.db.all(
				queryGetOpenPullRequestsByProductId,
				id,
			);

			const { error, data } = parseModelPullRequests(results);
			if (error) {
				this.log.error({ error: error }, "error parsing pull requests");
				return { error };
			}

			return Promise.resolve({ data });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getOpenPullRequests(): Promise<StoreActionResult<ModelPullRequest[]>> {
		try {
			const results = await this.db.all(queryGetOpenPullRequests);
			const { error, data } = parseModelPullRequests(results);
			if (error) {
				this.log.error({ error: error }, "error parsing pull requests");
				return { error };
			}

			return Promise.resolve({ data });
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });

			return Promise.resolve({
				error: err,
			});
		}
	}

	async getPullRequestInsights(): Promise<
		StoreActionResult<ModelPullRequestInsights>
	> {
		try {
			const result = await this.db.all(queryGetPullRequestInsights);

			const transformed = transformToPullRequestInsights(result);

			const data = modelPullRequestInsights.parse(transformed);

			return { data };
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });
			return {
				error: err,
			};
		}
	}

	async getPullRequestInsightsByProduct(
		productId: string,
	): Promise<StoreActionResult<ModelPullRequestInsights>> {
		try {
			const result = await this.db.all(
				queryGetPullRequestInsightsByProduct,
				productId,
			);

			const transformed = transformToPullRequestInsights(result);

			const data = modelPullRequestInsights.parse(transformed);

			return { data };
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });
			return {
				error: err,
			};
		}
	}

	async getSecurityAdvisoryInsights(): Promise<
		StoreActionResult<ModelSecurityAdvisoryInsights>
	> {
		try {
			const result = await this.db.all(queryGetSecurityAdvisoryInsights);
			const transformed = transformToSecurityAdvisoryInsights(result);

			const data = modelSecurityAdvisoryInsights.parse(transformed);

			return { data };
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });
			return {
				error: err,
			};
		}
	}

	async getSecurityAdvisoryInsightsByProduct(
		productId: string,
	): Promise<StoreActionResult<ModelSecurityAdvisoryInsights>> {
		try {
			const result = await this.db.all(
				queryGetSecurityAdvisoryInsightsByProduct,
				productId,
			);
			const transformed = transformToSecurityAdvisoryInsights(result);

			const data = modelSecurityAdvisoryInsights.parse(transformed);

			return { data };
		} catch (error) {
			const err = error as Error;
			this.log.error({ error: err.message });
			return {
				error: err,
			};
		}
	}
}

function parseModelSecurityAdvisory(
	tableData: TableData,
): StoreActionResult<ModelSecurityAdvisory[]> {
	const advisories: ModelSecurityAdvisory[] = [];
	for (const advisory of tableData) {
		const { error, data } = modelSecurityAdvisory.safeParse(advisory);
		if (error) {
			return { error };
		}

		advisories.push(data);
	}

	return { data: advisories };
}

function parseModelPullRequests(
	tableData: TableData,
): StoreActionResult<ModelPullRequest[]> {
	const pullRequests: ModelPullRequest[] = [];
	for (const pr of tableData) {
		const { error, data } = modelPullRequest.safeParse(pr);
		if (error) {
			return { error };
		}

		pullRequests.push(data);
	}

	return { data: pullRequests };
}
