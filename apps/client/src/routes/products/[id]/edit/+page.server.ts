import { service } from "$products/server.js";
import type { Actions } from "@sveltejs/kit";
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
	update: async ({ request }) => {
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

		return {
			success: true,
		};
	},
} satisfies Actions;
