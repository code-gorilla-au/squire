import { respondNotFound, respondServerError } from "$lib/apis/respond.js";
import { STATUS_OK } from "$lib/apis/types.js";
import { json } from "@sveltejs/kit";
import { ProductNotFoundError } from "products/src/errors.js";

export const POST = async ({ params, locals }) => {
	try {
		const { id } = params;

		const errors = await locals.productService.syncProductById(id);

		const resolveTitle =
			errors.length > 0
				? "Product sync complete with errors"
				: "Product sync complete";

		return json({
			statusCode: STATUS_OK,
			title: resolveTitle,
			errors,
			productId: id,
		});
	} catch (err) {
		if (err instanceof ProductNotFoundError) {
			return respondNotFound({ productId: params.id });
		}

		return respondServerError({ productId: params.id });
	}
};
