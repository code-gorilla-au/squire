import { randomUUID } from "node:crypto";
import type {
	PullRequest,
	Repository,
	VulnerabilityAlerts,
} from "squire-github";
import type {
	ModelPullRequest,
	ModelRepository,
	ModelSecurity,
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
		createdAt: new Date(),
		updatedAt: new Date(),
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
		mergedAt: node.mergedAt,
		createdAt: node.createdAt,
		updatedAt: new Date(),
	};
}
