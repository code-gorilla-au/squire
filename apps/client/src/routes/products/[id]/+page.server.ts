import { service } from "$lib/server/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const advisory = await service.getSecurityAdvisoryByProductId(id);
	const repos = await service.getReposByProductId(id);
	const product = await service.getProductById(id);
	const pullRequests = await service.getPullRequestsByProductId(id);

	return {
		props: {
			securityAdvisory: advisory,
			repositories: repos,
			product,
			pullRequests,
		},
	};
};
