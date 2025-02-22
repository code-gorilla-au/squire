import { STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND } from "$lib/apis";
import { error } from "@sveltejs/kit";
import { ProductNotFoundError } from "products/src/errors";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	try {
		const product = await locals.productService.getProductById(id);

		return {
			product,
		};
	} catch (err) {
		if (err instanceof ProductNotFoundError) {
			error(STATUS_NOT_FOUND, "Product not found");
			return;
		}
		error(STATUS_INTERNAL_SERVER_ERROR, "Internal server error");
	}
};
