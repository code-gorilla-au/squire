import { service } from "$lib/server/products";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const insights = await service.getInsights();

	return {
		insights,
	};
};
