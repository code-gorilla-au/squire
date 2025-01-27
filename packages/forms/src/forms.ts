import type { z } from "zod";

/**
 * transform zod errors to a more readable format
 * @param error error object
 */
export function transformZodErrors(error: z.ZodError) {
	return error.errors.map((err) => {
		return {
			field: err.path.join("."),
			message: err.message,
		};
	});
}

/**
 * get form data from a request
 * @param req HTTP request
 */
export async function formFromRequest(req: Request) {
	const data = await req.formData();
	const entries = data.entries();
	return Object.fromEntries(entries);
}
