import { z } from "zod";

export const modelRepository = z.object({
	id: z.string(),
	name: z.string(),
	url: z.string(),
	topic: z.string(),
	owner: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ModelRepository = z.infer<typeof modelRepository>;

export const repositoryDto = z.object({
	id: z.string(),
	name: z.string(),
	url: z.string(),
	topic: z.string(),
	owner: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type RepositoryDto = z.infer<typeof repositoryDto>;

export const modelSecurity = z.object({
	id: z.string(),
	externalId: z.string(),
	repositoryName: z.string(),
	packageName: z.string(),
	state: z.string(),
	severity: z.string(),
	patchedVersion: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ModelSecurity = z.infer<typeof modelSecurity>;

export const modelSecurityAdvisory = z.object({
	id: z.string(),
	externalId: z.string(),
	packageName: z.string(),
	patchedVersion: z.string(),
	severity: z.string(),
	state: z.string(),
	repoOwner: z.string(),
	repoName: z.string(),
	repoUrl: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ModelSecurityAdvisory = z.infer<typeof modelSecurityAdvisory>;

export const modelPullRequest = z.object({
	id: z.string(),
	externalId: z.string(),
	title: z.string(),
	repositoryName: z.string(),
	repoOwner: z.string(),
	repoName: z.string(),
	url: z.string(),
	state: z.string(),
	author: z.string(),
	mergedAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ModelPullRequest = z.infer<typeof modelPullRequest>;

export const pullRequestDto = z.object({
	id: z.string(),
	externalId: z.string(),
	title: z.string(),
	repositoryName: z.string(),
	repoOwner: z.string(),
	repoName: z.string(),
	url: z.string(),
	state: z.string(),
	author: z.string(),
	mergedAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type PullRequestDto = z.infer<typeof pullRequestDto>;

export type AdvisorySeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export const securityAdvisoryDto = z.object({
	id: z.string(),
	externalId: z.string(),
	packageName: z.string(),
	patchedVersion: z.string(),
	severity: z.custom<AdvisorySeverity>(),
	state: z.string(),
	repoOwner: z.string(),
	repoName: z.string(),
	repoUrl: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type SecurityAdvisoryDto = z.infer<typeof securityAdvisoryDto>;

export const modelProduct = z.object({
	id: z.string(),
	name: z.string(),
	tags: z.array(z.string()),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ModelProduct = z.infer<typeof modelProduct>;

export const productDto = z.object({
	id: z.string(),
	name: z.string(),
	tags: z.array(z.string()),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ProductDto = z.infer<typeof productDto>;

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
