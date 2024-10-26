import { service } from "$products/server";

export const actions = {
	default: async ({ params }) => {
		const { id } = params;

		const advisory = await service.getSecurityAdvisoryByProductId(id);
		const repos = await service.getReposByProductId(id);
		return {
			props: {
				securityAdvisory: advisory,
				repositories: repos,
			},
		};
	},
};
