import type { Database } from "duckdb-async";
import type {
	ModelRepository,
	ModelSecurity,
	StoreActionResult,
} from "./types";
import { logger } from "toolbox";

export const queryCreateRepoTable = `
    CREATE TABLE IF NOT EXISTS repositories (
        id uuid PRIMARY KEY,
        name VARCHAR UNIQUE,
        url VARCHAR,
        topic VARCHAR,
        createdAt TIMESTAMP WITH TIME ZONE,
        updatedAt TIMESTAMP WITH TIME ZONE
    );
`;

export const queryCreateSecurityTable = `
    CREATE TABLE IF NOT EXISTS securities (
        id uuid PRIMARY KEY,
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
        createdAt,
        updatedAt
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        now(),
        now()
    )
`;

export const queryInsertSecurity = `
    INSERT INTO securities (
        id,
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
        now(),
        now()
    )
`;

const migrations = [queryCreateRepoTable, queryCreateSecurityTable];

export function initRepository(db: Database) {
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
					stmt.run(repo.id, repo.name, repo.url, repo.topic);
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
					stmt.run(
						security.id,
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
	};
}
