import { service } from "$lib/server/products";
import { error } from "@sveltejs/kit";
import { ProductNotFoundError } from "products/src/errors";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const product = await service.getProductById(id);

		return {
			product,
		};
	} catch (err) {
		if (err instanceof ProductNotFoundError) {
			error(404, "Product not found");
			return;
		}
		error(500, "Internal server error");
	}
};
