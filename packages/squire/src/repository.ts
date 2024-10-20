import type { Database } from "duckdb-async";
import type {
	ModelRepository,
	ModelSecurity,
	ModelSecurityAdvisory,
	Store,
	StoreActionResult,
} from "./types";
import { logger } from "toolbox";

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
        now(),
        now()
    ) ON CONFLICT (externalId) DO UPDATE SET state = EXCLUDED.state, 
	 	severity = EXCLUDED.severity, 
		patchedVersion = EXCLUDED.patchedVersion, 
		updatedAt = now();
`;

const querySelectAllOpenSecByRepo = `
	SELECT * FROM securities WHERE state = 'OPEN' AND repositoryId = $1;
`;

const querySelectSecurityAdvisory = `
	SELECT sec.id, 
		sec.externalId, 
		sec.state,
		sec.createdAt,
		sec.updatedAt, 
		repo.owner as repoOwner, 
		repo.name as repoName
	FROM securities sec
	JOIN repositories repo ON sec.repositoryId = repo.id
	WHERE state = 'OPEN'
	ORDER BY sec.updatedAt DESC
	LIMIT $1;
`;

const migrations = [queryCreateRepoTable, queryCreateSecurityTable];

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
		async getOpenSecByRepoId(
			repoId: string,
		): Promise<StoreActionResult<ModelSecurity[]>> {
			try {
				const result = await db.all(querySelectAllOpenSecByRepo, repoId);

				return Promise.resolve({
					data: result as ModelSecurity[],
				});
			} catch (error) {
				const err = error as Error;
				logger.error({ error: err.message });

				return Promise.resolve({
					error: err,
				});
			}
		},
		async getSecurityAdvisoryOrderByLastUpdated(
			limit: number,
		): Promise<StoreActionResult<ModelSecurityAdvisory[]>> {
			try {
				const result = await db.all(querySelectSecurityAdvisory, limit);

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
	};
}
