export interface QuerySearch<T> {
	data: {
		search: {
			pageInfo: {
				endCursor: null;
				hasNextPage: boolean;
			};
			edges: Node<T>[];
		};
	};
}

export interface RootNode<T> {
	pageInfo: {
		endCursor: null;
		hasNextPage: boolean;
	};
	edges: Node<T>[];
}

export interface Node<T> {
	node: T;
}

export interface ModelRepository {
	url: string;
	name: string;
	vulnerabilityAlerts: RootNode<ModelVulnerabilityAlerts>;
}

export interface ModelVulnerabilityAlerts {
	state: string;
	securityVulnerability: ModelSecurityVulnerability;
}

export interface ModelSecurityVulnerability {
	package: {
		name: string;
	};
	advisory: {
		severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
	};
	firstPatchedVersion: {
		identifier: string;
	};
	updatedAt: Date;
}

export interface PrFilter {
	prefix?: string[];
	exact?: string[];
}

export interface ClientOptions {
	ghToken: string;
	defaultOwner: string;
	defaultTopics?: string[];
}

export interface SearchOptions {
	topics?: string[];
	owner?: string;
}

export interface SearchParameters {
	topics: string[];
	owner: string;
}

export interface Client {
	searchRepos(options?: SearchOptions): Promise<QuerySearch<ModelRepository>>;
}
