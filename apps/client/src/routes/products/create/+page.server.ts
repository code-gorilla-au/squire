import { service } from "$lib/server/products";
import { type Actions, redirect } from "@sveltejs/kit";
import { formFromRequest, transformZodErrors } from "forms";
import type { ProductDto } from "products";
import { formSchema } from "./form-schema";

export const actions = {
	default: async ({ request }) => {
		const formData = await formFromRequest(request);

		const { error, data } = formSchema.safeParse(formData);
		if (error) {
			return {
				success: false,
				errors: transformZodErrors(error),
			};
		}

		let product: ProductDto;

		try {
			product = await service.createProduct(data.name, [data.tags]);
		} catch (error) {
			const err = error as Error;
			return {
				success: false,
				errors: [{ field: "product", message: err.message }],
			};
		}

		redirect(303, `/products/${product.id}/sync`);
	},
} satisfies Actions;
