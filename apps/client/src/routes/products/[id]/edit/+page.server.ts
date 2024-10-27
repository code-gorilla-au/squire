import { service } from "$products/server.js";

export const load = async ({ params }) => {
	const { id } = params;

	const product = await service.getProductById(id);

	return {
		props: {
			id,
			product,
		},
	};
};
