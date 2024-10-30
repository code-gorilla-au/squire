import { service } from "$lib/server/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const products = await service.getAllProducts();

	return {
		props: {
			products,
		},
	};
};
