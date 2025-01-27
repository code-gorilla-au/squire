import { service } from "$lib/server/products";
import { formFromRequest, transformZodErrors } from "forms";
import { type Actions, redirect } from "@sveltejs/kit";
import { formSchema } from "./form-schema";

export const actions = {
	default: async ({ request }) => {
		const formData = formFromRequest(request);

		const { error, data } = formSchema.safeParse(formData);
		if (error) {
			return {
				success: false,
				errors: transformZodErrors(error),
			};
		}

		try {
			await service.createProduct(data.name, [data.tags]);
			redirect(303, "/");
		} catch (error) {
			const err = error as Error;
			return {
				success: false,
				errors: [{ field: "product", message: err.message }],
			};
		}
	},
} satisfies Actions;
