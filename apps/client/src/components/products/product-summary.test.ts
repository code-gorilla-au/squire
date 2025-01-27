import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import ProductSummary from "./product-summary.svelte";
import type { ProductDto } from "products";

describe("DashboardSummary component", () => {
	const product = {
		id: "id-1",
		name: "name",
		createdAt: new Date(),
		updatedAt: new Date(),
		tags: ["tag1"],
	} as ProductDto;

	it("should render sec advisory", () => {
		render(ProductSummary, {
			pullRequests: [],
			secAdvisory: [
				{
					id: "id-1",
					externalId: "1",
					packageName: "package-name",
					patchedVersion: "1.0.0",
					severity: "LOW",
					state: "OPEN",
					repoOwner: "owner-test",
					repoName: "repo-test",
					repoUrl: "test",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			product,
			repos: [],
		});

		expect(screen.getByText("package-name")).toBeVisible();
		expect(screen.getByText("owner-test")).toBeVisible();
		expect(screen.getByText("repo-test")).toBeVisible();
		expect(screen.getByText("LOW")).toBeVisible();
	});
	it("should render security advisory card", () => {
		render(ProductSummary, {
			pullRequests: [],
			secAdvisory: [],
			product,
			repos: [],
		});

		expect(screen.getByText("Security Advisories (0)")).toBeInTheDocument();
	});
	it("should render security empty slate", () => {
		render(ProductSummary, {
			pullRequests: [],
			secAdvisory: [],
			product,
			repos: [],
		});

		expect(
			screen.getByText("No security advisories found"),
		).toBeInTheDocument();
	});
	it("should return open pull request card", () => {
		render(ProductSummary, {
			pullRequests: [],
			secAdvisory: [],
			product,
			repos: [],
		});

		expect(screen.getByText("Open pull requests (0)")).toBeInTheDocument();
	});
	it("should render pull request card", () => {
		render(ProductSummary, {
			pullRequests: [
				{
					id: "id-1",
					externalId: "1",
					title: "title",
					repoOwner: "owner-test",
					repositoryName: "repo-test",
					repoName: "repo-test",
					url: "test",
					state: "OPEN",
					author: "author-test",
					createdAt: new Date(),
					updatedAt: new Date(),
					mergedAt: new Date(),
				},
			],
			secAdvisory: [],
			product,
			repos: [],
		});

		expect(screen.getByText("title")).toBeVisible();
		expect(screen.getByText("owner-test")).toBeVisible();
		expect(screen.getByText("repo-test")).toBeVisible();
		expect(screen.getByText("author-test")).toBeVisible();
	});
	it("should render pull request empty slate", () => {
		render(ProductSummary, {
			pullRequests: [],
			secAdvisory: [],
			product,
			repos: [],
		});

		expect(screen.getByText("No open pull requests")).toBeInTheDocument();
	});
});
