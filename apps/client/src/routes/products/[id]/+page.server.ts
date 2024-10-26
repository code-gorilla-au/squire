import { service } from "$products/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const advisory = await service.getSecurityAdvisoryByProductId(id);
	const repos = await service.getReposByProductId(id);
	const product = await service.getProductById(id);
	return {
		props: {
			securityAdvisory: advisory,
			repositories: repos,
			product,
		},
	};
};
