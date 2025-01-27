import { respondNotFound, respondServerError } from "$lib/apis/respond.js";
import { STATUS_OK } from "$lib/apis/types.js";
import { service } from "$lib/server/products";
import { json } from "@sveltejs/kit";
import { ProductNotFoundError } from "products/src/errors.js";

export const POST = async (request) => {
	try {
		const { id } = request.params;

		const errors = await service.syncProductById(id);

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
			return respondNotFound({ productId: request.params.id });
		}

		return respondServerError({ productId: request.params.id });
	}
};
