import type { Database } from "duckdb-async";
import { logger } from "toolbox";
import type { Store } from "./interfaces";
import type {
	ModelProduct,
	ModelPullRequest,
	ModelRepository,
	ModelSecurity,
	ModelSecurityAdvisory,
	RepositoryDto,
	StoreActionResult,
} from "./models";

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
        repositoryId uuid,
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
		repositoryId uuid,
		url VARCHAR,
		state VARCHAR,
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
        repositoryId,
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
        now()
    ) ON CONFLICT (externalId) DO UPDATE SET state = EXCLUDED.state, 
	 	severity = EXCLUDED.severity, 
		patchedVersion = EXCLUDED.patchedVersion, 
		updatedAt = now();
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
	JOIN repositories repo ON sec.repositoryId = repo.id
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
	JOIN repositories repo ON sec.repositoryId = repo.id
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
		repositoryId,
		url,
		state,
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
	JOIN repositories r ON pr.repositoryId = r.id
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
	JOIN repositories r ON pr.repositoryId = r.id
	JOIN products p ON r.topic IN p.tags
	WHERE pr.state = 'OPEN';
`;

const migrations = [
	queryCreateRepoTable,
	queryCreateSecurityTable,
	queryCreateProductsTable,
	queryCreateTablePullRequests,
];

export function initRepository(db: Database): Store {
	return {
		async initTables(): Promise<StoreActionResult> {
			try {
				await db.run(migrations.join(";"));
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return {
					error: err,
				};
			}
		},
		async bulkInsertRepos(
			repos: ModelRepository[],
		): Promise<StoreActionResult> {
			try {
				logger.debug("Inserting repos into database");
				const stmt = await db.prepare(queryInsertRepo);

				for (const repo of repos) {
					await stmt.run(repo.id, repo.name, repo.url, repo.topic, repo.owner);
				}

				await stmt.finalize();

				logger.debug("Inserted repos into database");
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return {
					error: err,
				};
			}
		},
		async bulkInsertSecVulnerabilities(
			securities: ModelSecurity[],
		): Promise<StoreActionResult> {
			try {
				const stmt = await db.prepare(queryInsertSecurity);

				for (const security of securities) {
					await stmt.run(
						security.id,
						security.externalId,
						security.repositoryId,
						security.packageName,
						security.state,
						security.severity,
						security.patchedVersion,
						security.createdAt,
					);
				}

				await stmt.finalize();

				logger.debug("Inserted repos into database");
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return {
					error: err,
				};
			}
		},
		async bulkInsertPullRequests(
			pullRequests: ModelPullRequest[],
		): Promise<StoreActionResult> {
			try {
				const stmt = await db.prepare(queryInsertPullRequest);

				for (const pr of pullRequests) {
					await stmt.run(
						pr.id,
						pr.externalId,
						pr.title,
						pr.repositoryId,
						pr.url,
						pr.state,
						pr.mergedAt,
						pr.createdAt,
					);
				}

				await stmt.finalize();

				logger.debug("Inserted pull requests into database");
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return {
					error: err,
				};
			}
		},
		async getAllSecurityAdvisory(
			limit = 100,
		): Promise<StoreActionResult<ModelSecurityAdvisory[]>> {
			try {
				const result = await db.all(queryGetAllSecurityAdvisory, limit);
				return Promise.resolve({ data: result as ModelSecurityAdvisory[] });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getSecurityAdvisoryByProductId(
			productId: string,
			limit: number,
		): Promise<StoreActionResult<ModelSecurityAdvisory[]>> {
			try {
				const result = await db.all(
					queryGetAllSecurityAdvisoryByProduct,
					productId,
					limit,
				);

				return Promise.resolve({
					data: result as ModelSecurityAdvisory[],
				});
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getReposByProductId(
			productId: string,
		): Promise<StoreActionResult<ModelRepository[]>> {
			try {
				const result = await db.all(queryGetReposByProductId, productId);
				return Promise.resolve({ data: result as RepositoryDto[] });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async insertProduct(
			name: string,
			tags: string[],
		): Promise<StoreActionResult> {
			try {
				const results = await db.all(queryGetProductByName, name);
				if (results.length > 0) {
					return Promise.resolve({
						error: new Error("Product already exists"),
					});
				}

				await db.run(queryInsertIntoProducts, name, tags);
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getProductById(id: string): Promise<StoreActionResult<ModelProduct>> {
			try {
				const result = await db.all(queryGetProductById, id);
				return Promise.resolve({ data: result[0] as ModelProduct });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
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
				const existingProducts = (await db.all(
					queryGetProductByName,
					id,
				)) as ModelProduct[];

				const matched = existingProducts.find((p) => p.name === name);
				if (matched && matched.id !== id) {
					return Promise.resolve({
						error: new Error("Product name already exists"),
					});
				}

				await db.run(queryUpdateProductById, id, name, tags);
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async deleteProduct(id: string): Promise<StoreActionResult> {
			try {
				await db.run(queryDeleteProductById, id);
				return Promise.resolve({ data: null });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getAllProductTags(): Promise<StoreActionResult<string[]>> {
			try {
				const result = await db.all(queryGetAllProductTags);
				return Promise.resolve({
					data: result.map((r) => r.tag) as string[],
				});
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message }, "could not get all product tags");

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getAllProducts(): Promise<StoreActionResult<ModelProduct[]>> {
			try {
				const result = await db.all(queryGetAllProducts);
				return Promise.resolve({ data: result as ModelProduct[] });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getOpenPullRequestsByProductId(
			id: string,
		): Promise<StoreActionResult<ModelPullRequest[]>> {
			try {
				const result = await db.all(queryGetOpenPullRequestsByProductId, id);
				return Promise.resolve({ data: result as ModelPullRequest[] });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},

		async getOpenPullRequests(): Promise<
			StoreActionResult<ModelPullRequest[]>
		> {
			try {
				const result = await db.all(queryGetOpenPullRequests);
				return Promise.resolve({ data: result as ModelPullRequest[] });
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
	};
}
