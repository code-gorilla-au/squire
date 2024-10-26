import type {
	ModelProduct,
	ModelRepository,
	ModelSecurity,
	ModelSecurityAdvisory,
	StoreActionResult,
} from "./models";

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
	getAllProducts(): Promise<StoreActionResult<ModelProduct[]>>;
}
