import { service } from "$products/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const products = await service.getAllProducts();
	const securityAdvisories = await service.getAllSecurityAdvisories();

	return {
		props: {
			products,
			securityAdvisories,
		},
	};
};
