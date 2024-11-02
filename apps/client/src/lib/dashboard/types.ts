import type { ProductDto, PullRequestDto, SecurityAdvisoryDto } from "squire";

export type DashboardSummary = {
	pullRequests: PullRequestDto[];
	securityAdvisories: SecurityAdvisoryDto[];
	products: ProductDto[];
};
