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
	repositoryId: string;
	packageName: string;
	state: string;
	severity: string;
	patchedVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

export type SecurityDto = ModelSecurity;

export type StoreActionResult<T> = StoreActionSuccess<T> | StoreActionFailure;

export type StoreActionSuccess<T> = {
	data?: T;
	error: never;
};

export type StoreActionFailure = {
	data: never;
	error: Error;
};
