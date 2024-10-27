import { service } from "$products/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const products = await service.getAllProducts();

	return {
		props: {
			products,
		},
	};
};
