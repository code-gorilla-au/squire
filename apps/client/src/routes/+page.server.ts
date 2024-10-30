import { service } from "$lib/server/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const products = await service.getAllProducts();
	const securityAdvisories = await service.getAllSecurityAdvisories();
	const pullRequests = await service.getAllOpenPullRequests();

	return {
		props: {
			products,
			securityAdvisories,
			pullRequests,
		},
	};
};
