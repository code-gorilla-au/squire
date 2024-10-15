import type { Database } from "duckdb-async";
import type { ModelRepository, ModelSecurity } from "./types";

export const queryCreateRepoTable = `
    CREATE TABLE IF NOT EXISTS repositories (
        id uuid PRIMARY KEY,
        name VARCHAR,
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

export const migrations = [queryCreateRepoTable, queryCreateSecurityTable];

export function initRepository(db: Database) {
	return {
		async bulkInsertRepos(repos: ModelRepository[]) {
			const stmt = await db.prepare(queryInsertRepo);

			for (const repo of repos) {
				stmt.run(repo.id, repo.name, repo.url, repo.topic);
			}

			await stmt.finalize();
		},
		async bulkInsertSecVulnerabilities(securities: ModelSecurity[]) {
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
		},
	};
}
