import type { ProductDto, PullRequestDto, SecurityAdvisoryDto } from "products";

export type DashboardSummary = {
	pullRequests: PullRequestDto[];
	securityAdvisories: SecurityAdvisoryDto[];
	products: ProductDto[];
};
