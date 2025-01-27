import { service } from "$lib/server/products.js";
import { type Actions, redirect } from "@sveltejs/kit";
import { logger } from "toolbox";
import type { PageServerLoad } from "./$types.js";
import { formFromRequest } from "forms";
import { formSchema } from "./form-schema.js";
import { transformZodErrors } from "forms";

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const product = await service.getProductById(id);

	return {
		id,
		product,
	};
};

export const actions = {
	update: async ({ request, params }) => {
		const formData = await formFromRequest(request);

		const { error, data } = formSchema.safeParse(formData);
		if (error) {
			return {
				success: false,
				errors: transformZodErrors(error),
			};
		}

		await service.updateProduct(params.id ?? "", data.name, [data.tags]);

		logger.info("Product updated", {
			id: params.id,
			name: data.name,
			tags: data.tags,
		});

		redirect(303, "/");
	},
	remove: ({ params }) => {
		service.removeProduct(params.id ?? "");

		logger.info("Product removed", { id: params.id });
		redirect(303, "/");
	},
} satisfies Actions;
