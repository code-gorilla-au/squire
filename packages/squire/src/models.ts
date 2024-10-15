export interface ModelRepository {
	id: string;
	name: string;
	url: string;
	topic: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ModelSecurity {
	id: string;
	repositoryId: string;
	packageName: string;
	state: string;
	severity: string;
	patchedVersion: string;
	createdAt: string;
	updatedAt: string;
}
