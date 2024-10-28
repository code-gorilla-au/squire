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
	nodes: T[];
}

export interface Node<T> {
	node: T;
}

export interface ModelRepository {
	url: string;
	name: string;
	owner: {
		login: string;
	};
	vulnerabilityAlerts: RootNode<ModelVulnerabilityAlerts>;
	pullRequests: RootNode<ModelPullRequest>;
}

export type VulnerabilityAlertState =
	| "OPEN"
	| "FIXED"
	| "DISMISSED"
	| "AUTO_DISMISSED";

export interface ModelVulnerabilityAlerts {
	state: VulnerabilityAlertState;
	id: string;
	number: number;
	securityVulnerability: ModelSecurityVulnerability;
	createdAt: Date;
}

export type AdvisorySeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface ModelSecurityVulnerability {
	package: {
		name: string;
	};
	advisory: {
		severity: AdvisorySeverity;
	};
	firstPatchedVersion: {
		identifier: string;
	};
	updatedAt: Date;
}

export interface ModelPullRequest {
	id: string;
	state: "OPEN" | "CLOSED" | "MERGED";
	createdAt: Date;
	mergedAt: Date;
	permalink: string;
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
