import type {
	ModelRepository,
	ModelSecurity,
	ModelSecurityAdvisory,
	StoreActionResult,
} from "./types";

export interface Store {
	bulkInsertRepos(repos: ModelRepository[]): Promise<StoreActionResult>;
	bulkInsertSecVulnerabilities(
		securities: ModelSecurity[],
	): Promise<StoreActionResult>;
	initTables(): Promise<StoreActionResult>;
	getOpenSecByRepoId(
		repoId: string,
	): Promise<StoreActionResult<ModelSecurity[]>>;
	getSecurityAdvisoryOrderByLastUpdated(
		limit: number,
	): Promise<StoreActionResult<ModelSecurityAdvisory[]>>;
	insertProduct(name: string, tags: string[]): Promise<StoreActionResult>;
}
