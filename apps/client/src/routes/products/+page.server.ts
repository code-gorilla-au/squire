import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const products = await locals.productService.getAllProducts();

	return {
		props: {
			products,
		},
	};
};
