import { z } from "zod";
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
	repositoryName: string;
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
	title: string;
	repositoryName: string;
	repoOwner: string;
	repoName: string;
	url: string;
	state: string;
	author: string;
	mergedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface PullRequestDto {
	id: string;
	externalId: string;
	title: string;
	repositoryName: string;
	repoOwner: string;
	repoName: string;
	url: string;
	state: string;
	author: string;
	mergedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type AdvisorySeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface SecurityAdvisoryDto {
	id: string;
	externalId: string;
	packageName: string;
	patchedVersion: string;
	severity: AdvisorySeverity;
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

export const modelPullRequestInsights = z.object({
	totalMerged: z.number(),
	daysToMerge: z.number(),
	maxDaysToMerge: z.number(),
	minDaysToMerge: z.number(),
});

export type ModelPullRequestInsights = z.infer<typeof modelPullRequestInsights>;

export const pullRequestInsightsDto = z.object({
	totalMerged: z.number(),
	daysToMerge: z.number(),
	maxDaysToMerge: z.number(),
	minDaysToMerge: z.number(),
});

export type PullRequestInsightsDto = z.infer<typeof pullRequestInsightsDto>;

export const modelSecurityAdvisoryInsights = z.object({
	total: z.number(),
	resolved: z.number(),
	open: z.number(),
	daysToMerge: z.number(),
	maxDaysToMerge: z.number(),
	minDaysToMerge: z.number(),
});

export type ModelSecurityAdvisoryInsights = z.infer<
	typeof modelSecurityAdvisoryInsights
>;

export const securityAdvisoryInsightsDto = z.object({
	total: z.number(),
	resolved: z.number(),
	open: z.number(),
	daysToMerge: z.number(),
	maxDaysToMerge: z.number(),
	minDaysToMerge: z.number(),
});

export type SecurityAdvisoryInsightsDto = z.infer<
	typeof securityAdvisoryInsightsDto
>;

export type InsightsDto = {
	pullRequests: PullRequestInsightsDto;
	securityAdvisories: SecurityAdvisoryInsightsDto;
};
