export interface ModelRepository {
	id: string;
	name: string;
	url: string;
	topic: string;
	owner: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface RepositoryDto {
	id: string;
	name: string;
	url: string;
	topic: string;
	owner: string;
	createdAt: Date;
	updatedAt: Date;
}

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

export interface ModelSecurityAdvisory {
	id: string;
	externalId: string;
	packageName: string;
	patchedVersion: string;
	severity: string;
	state: string;
	repoOwner: string;
	repoName: string;
	repoUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ModelPullRequest {
	id: string;
	externalId: string;
	repositoryId: string;
	repoOwner: string;
	repoName: string;
	url: string;
	state: string;
	mergedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface PullRequestDto {
	id: string;
	externalId: string;
	repositoryId: string;
	repoOwner: string;
	repoName: string;
	url: string;
	state: string;
	mergedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface SecurityAdvisoryDto {
	id: string;
	externalId: string;
	packageName: string;
	patchedVersion: string;
	severity: string;
	state: string;
	repoOwner: string;
	repoName: string;
	repoUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ModelProduct {
	id: string;
	name: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductDto {
	id: string;
	name: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

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
