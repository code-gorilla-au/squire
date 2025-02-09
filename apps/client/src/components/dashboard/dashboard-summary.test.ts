import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import DashboardSummary from "./dashboard-summary.svelte";

describe("DashboardSummary component", () => {
	it("should render sec advisory", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [
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
			products: [],
		});

		expect(screen.getByText("package-name")).toBeVisible();
		expect(screen.getByText("owner-test")).toBeVisible();
		expect(screen.getByText("repo-test")).toBeVisible();
		expect(screen.getByText("LOW")).toBeVisible();
	});
	it("should render security advisory card", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(screen.getByText("Security Advisories (0)")).toBeInTheDocument();
	});
	it("should render security empty slate", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(
			screen.getByText("No security advisories found"),
		).toBeInTheDocument();
	});
	it("should return open pull request card", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(screen.getByText("Open pull requests (0)")).toBeInTheDocument();
	});
	it("should render pull request card", () => {
		render(DashboardSummary, {
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
			securityAdvisories: [],
			products: [],
		});

		expect(screen.getByText("title")).toBeVisible();
		expect(screen.getByText("owner-test")).toBeVisible();
		expect(screen.getByText("repo-test")).toBeVisible();
		expect(screen.getByText("author-test")).toBeVisible();
	});
	it("should render pull request empty slate", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(screen.getByText("No open pull requests")).toBeInTheDocument();
	});
	it("should return products card", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(screen.getByText("Products (0)")).toBeInTheDocument();
	});
	it("should render product card", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [
				{
					id: "id-1",
					name: "name",
					createdAt: new Date(),
					updatedAt: new Date(),
					tags: ["tag1"],
				},
			],
		});

		expect(screen.getByText("name")).toBeVisible();
		expect(screen.getByText("tag1")).toBeVisible();
	});
	it("should return product empty slate", () => {
		render(DashboardSummary, {
			pullRequests: [],
			securityAdvisories: [],
			products: [],
		});

		expect(
			screen.getByText("No products found, create your first product"),
		).toBeInTheDocument();
	});
});
