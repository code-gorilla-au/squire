import { service } from "$lib/server/products.js";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { logger } from "toolbox";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const product = await service.getProductById(id);

	return {
		props: {
			id,
			product,
		},
	};
};

export const actions = {
	update: async ({ request, params }) => {
		const data = await request.formData();

		const name = data.get("name");
		const tags = data.get("tags");

		if (!name) {
			return fail(400, {
				success: false,
				errors: ["Name is required"],
			});
		}

		if (!tags) {
			return fail(400, {
				success: false,
				errors: ["Tags is required"],
			});
		}

		await service.updateProduct(params.id ?? "", name.toString(), [
			tags.toString(),
		]);

		logger.info("Product updated", { id: params.id, name, tags });

		redirect(303, "/");
	},
	remove: ({ params }) => {
		service.removeProduct(params.id ?? "");

		logger.info("Product removed", { id: params.id });
		redirect(303, "/");
	},
} satisfies Actions;
