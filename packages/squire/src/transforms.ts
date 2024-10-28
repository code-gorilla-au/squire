import { randomUUID } from "node:crypto";
import type {
	ModelRepository as GhModelRepo,
	ModelPullRequest as GHModelPullRequest,
	ModelVulnerabilityAlerts,
} from "squire-github";
import type {
	ModelPullRequest,
	ModelRepository,
	ModelSecurity,
} from "./models";

export function generateRepoFromGhModel(
	ghRepo: GhModelRepo,
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
	ghRepo: GhModelRepo,
	repositoryId: string,
): ModelSecurity[] {
	return ghRepo.vulnerabilityAlerts.nodes.map((edge) => {
		return transformToSecurityModel(edge, repositoryId);
	});
}

function transformToSecurityModel(
	edge: ModelVulnerabilityAlerts,
	repositoryId: string,
): ModelSecurity {
	return {
		id: randomUUID(),
		externalId: edge.id,
		repositoryId,
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
	nodes: GhModelRepo,
	repositoryId: string,
): ModelPullRequest[] {
	return nodes.pullRequests.nodes.map((node) => {
		return transformToPullRequestFromGhModel(node, repositoryId);
	});
}

function transformToPullRequestFromGhModel(
	node: GHModelPullRequest,
	repositoryId: string,
): ModelPullRequest {
	return {
		id: randomUUID(),
		externalId: node.id,
		repositoryId: repositoryId,
		url: node.permalink,
		state: node.state,
		mergedAt: node.mergedAt,
		createdAt: node.createdAt,
		updatedAt: new Date(),
	};
}
