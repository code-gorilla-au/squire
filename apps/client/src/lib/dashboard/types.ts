import type {
	ProductDto,
	PullRequestDto,
	SecurityAdvisoryDto,
} from "../../../../../packages/products";

export type DashboardSummary = {
	pullRequests: PullRequestDto[];
	securityAdvisories: SecurityAdvisoryDto[];
	products: ProductDto[];
};
