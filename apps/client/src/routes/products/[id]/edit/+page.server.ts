import { service } from "$products/server.js";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { logger } from "toolbox";

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
} satisfies Actions;
