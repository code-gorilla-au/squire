import { randomUUID } from "node:crypto";
import type {
	ModelRepository as GhModelRepo,
	ModelVulnerabilityAlerts,
	Node,
} from "squire-github";
import type { ModelRepository, ModelSecurity } from "./types";

export function generateRepoFromGhModel(
	ghRepo: GhModelRepo,
	topic: string,
): ModelRepository {
	return {
		id: randomUUID(),
		name: ghRepo.name,
		url: ghRepo.url,
		topic,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

export function generateSecurityFromGhModel(
	ghRepo: GhModelRepo,
	repositoryId: string,
): ModelSecurity[] {
	return ghRepo.vulnerabilityAlerts.edges.map((edge) => {
		return transformToSecurityModel(edge, repositoryId);
	});
}

function transformToSecurityModel(
	edge: Node<ModelVulnerabilityAlerts>,
	repositoryId: string,
): ModelSecurity {
	return {
		id: randomUUID(),
		repositoryId,
		state: edge.node.state,
		packageName: edge.node.securityVulnerability.package.name,
		severity: edge.node.securityVulnerability.advisory.severity,
		patchedVersion:
			edge.node.securityVulnerability.firstPatchedVersion.identifier,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
