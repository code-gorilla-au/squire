import { randomUUID } from "node:crypto";
import type { TableData } from "duckdb-async";
import type {
	PullRequest,
	Repository,
	VulnerabilityAlerts,
} from "squire-github";
import type {
	AdvisorySeverity,
	ModelPullRequest,
	ModelRepository,
	ModelSecurity,
	ModelSecurityAdvisoryInsights,
} from "./models";

export function generateRepoFromGhModel(
	ghRepo: Repository,
	owner: string,
	topic: string,
): ModelRepository {
	return {
		id: randomUUID(),
		name: ghRepo.name,
		url: ghRepo.url,
		topic,
		owner,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

export function generateSecurityFromGhModel(
	ghRepo: Repository,
	repositoryName: string,
): ModelSecurity[] {
	return ghRepo.vulnerabilityAlerts.nodes.map((edge) => {
		return transformToSecurityModel(edge, repositoryName);
	});
}

function transformToSecurityModel(
	edge: VulnerabilityAlerts,
	repositoryName: string,
): ModelSecurity {
	return {
		id: randomUUID(),
		externalId: edge.id,
		repositoryName,
		state: edge.state,
		packageName: edge.securityVulnerability.package.name,
		severity: edge.securityVulnerability.advisory.severity,
		patchedVersion:
			edge.securityVulnerability?.firstPatchedVersion?.identifier ?? null,
		createdAt: edge.createdAt,
		updatedAt: edge.securityVulnerability.updatedAt,
	};
}

export function generatePullRequestFromGhModel(
	nodes: Repository,
	repositoryName: string,
	owner: string,
	repoName: string,
): ModelPullRequest[] {
	return nodes.pullRequests.nodes.map((node) => {
		return transformToPullRequestFromGhModel(
			node,
			repositoryName,
			owner,
			repoName,
		);
	});
}

function transformToPullRequestFromGhModel(
	node: PullRequest,
	repositoryName: string,
	owner: string,
	repoName: string,
): ModelPullRequest {
	return {
		id: randomUUID(),
		externalId: node.id,
		title: node.title,
		repositoryName,
		repoOwner: owner,
		repoName,
		url: node.permalink,
		state: node.state,
		author: node.author.login,
		mergedAt: node.mergedAt,
		createdAt: node.createdAt,
		updatedAt: new Date(),
	};
}

/**
 * Returns a weighting for the severity of an advisory
 * @param severity advisory severity weighting
 */
export function severityWeighting(severity: AdvisorySeverity): number {
	switch (severity) {
		case "LOW":
			return 1;
		case "MODERATE":
			return 2;
		case "HIGH":
			return 3;
		case "CRITICAL":
			return 4;
		default:
			return 0;
	}
}

export function transformToSecurityAdvisoryInsights(
	data: TableData,
): ModelSecurityAdvisoryInsights {
	if (data.length === 0) {
		throw new Error("No security advisory insights found");
	}

	return {
		total: Number(data[0].total),
		resolved: Number(data[0].resolved),
		open: Number(data[0].open),
		daysToMerge: Number.parseFloat(Number(data[0].daysToMerge).toFixed(2)),
		maxDaysToMerge: Number.parseFloat(
			Number(data[0].maxDaysToMerge).toFixed(2),
		),
		minDaysToMerge: Number.parseFloat(
			Number(data[0].minDaysToMerge).toFixed(2),
		),
	};
}

export function transformToPullRequestInsights(data: TableData) {
	if (data.length === 0) {
		throw new Error("No pull request insights found");
	}

	return {
		daysToMerge: Number.parseFloat(Number(data[0].daysToMerge).toFixed(2)),
		maxDaysToMerge: Number.parseFloat(
			Number(data[0].maxDaysToMerge).toFixed(2),
		),
		minDaysToMerge: Number.parseFloat(
			Number(data[0].minDaysToMerge).toFixed(2),
		),
		totalMerged: Number.parseFloat(Number(data[0].totalMerged).toFixed(2)),
	};
}
