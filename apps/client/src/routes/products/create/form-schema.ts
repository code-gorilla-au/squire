import { z } from "zod";

export const formSchema = z.object({
	name: z.string().nonempty(),
	tags: z.string().nonempty(),
});
