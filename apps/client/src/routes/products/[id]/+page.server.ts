import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const advisory =
		await locals.productService.getOpenSecurityAdvisoryByProductId(id);
	const repos = await locals.productService.getReposByProductId(id);
	const product = await locals.productService.getProductById(id);
	const pullRequests =
		await locals.productService.getPullRequestsByProductId(id);
	const insights = await locals.productService.getInsightsByProduct(id);

	return {
		securityAdvisory: advisory,
		repositories: repos,
		product,
		pullRequests,
		insights,
	};
};
