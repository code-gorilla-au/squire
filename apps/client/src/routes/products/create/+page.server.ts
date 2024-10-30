import { service } from "$lib/server/products";
import { type Actions, redirect } from "@sveltejs/kit";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get("name");
		const tags = data.get("tags");

		if (!name) {
			return {
				success: false,
				errors: ["Name is required"],
			};
		}

		if (!tags) {
			return {
				success: false,
				errors: ["Tags is required"],
			};
		}

		await service.createProduct(name.toString(), [tags?.toString()]);
		redirect(303, "/");
	},
} satisfies Actions;
