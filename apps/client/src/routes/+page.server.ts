import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const insights = await locals.productService.getInsights();

	return {
		insights,
	};
};
