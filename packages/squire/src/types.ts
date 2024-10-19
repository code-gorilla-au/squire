export interface ModelRepository {
	id: string;
	name: string;
	url: string;
	topic: string;
	createdAt: Date;
	updatedAt: Date;
}

export type RepositoryDto = ModelRepository;

export interface ModelSecurity {
	id: string;
	externalId: string;
	repositoryId: string;
	packageName: string;
	state: string;
	severity: string;
	patchedVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

export type SecurityDto = ModelSecurity;

export type StoreActionResult<T = null> =
	| StoreActionSuccess<T>
	| StoreActionFailure;

export type StoreActionSuccess<T = null> = {
	data?: T | undefined;
	error?: never;
};

export type StoreActionFailure = {
	data?: never;
	error: Error;
};

export interface Store {
	bulkInsertRepos(repos: ModelRepository[]): Promise<StoreActionResult>;
	bulkInsertSecVulnerabilities(
		securities: ModelSecurity[],
	): Promise<StoreActionResult>;
	initTables(): Promise<StoreActionResult>;
	getOpenSecByRepoId(
		repoId: string,
	): Promise<StoreActionResult<ModelSecurity[]>>;
	getReposWhereLastUpdatedIsOlderThan5Minutes(): Promise<
		StoreActionResult<ModelRepository[]>
	>;
	bulkUpdateSecurityVulnerabilities(
		vulnerabilities: ModelSecurity[],
	): Promise<StoreActionResult>;
}
