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

export interface Repository {
	url: string;
	name: string;
	owner: {
		login: string;
	};
	vulnerabilityAlerts: RootNode<VulnerabilityAlerts>;
	pullRequests: RootNode<PullRequest>;
}

export type VulnerabilityAlertState =
	| "OPEN"
	| "FIXED"
	| "DISMISSED"
	| "AUTO_DISMISSED";

export interface VulnerabilityAlerts {
	state: VulnerabilityAlertState;
	id: string;
	number: number;
	securityVulnerability: SecurityVulnerability;
	createdAt: Date;
}

export type AdvisorySeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface SecurityVulnerability {
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

export interface PullRequest {
	id: string;
	title: string;
	state: "OPEN" | "CLOSED" | "MERGED";
	createdAt: Date;
	mergedAt: Date;
	permalink: string;
	author: {
		login: string;
	};
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
	searchRepos(options?: SearchOptions): Promise<QuerySearch<Repository>>;
}
