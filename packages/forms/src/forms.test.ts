import { describe, expect, it } from "vitest";
import { z } from "zod";
import { transformZodErrors } from "./forms";

describe("transformZodErrors", () => {
	it("should return errors from a simple object", () => {
		const testErr = z.object({
			test: z.string().min(1),
		});

		const { error } = testErr.safeParse({
			test: "",
		});

		const formErr = transformZodErrors(error as z.ZodError);
		expect(formErr).toEqual([
			{
				field: "test",
				message: "String must contain at least 1 character(s)",
			},
		]);
	});
	it("should return errors from a nested object", () => {
		const testErr = z.object({
			nested: z.object({
				test: z.string().min(1),
			}),
		});

		const { error } = testErr.safeParse({
			nested: {
				test: "",
			},
		});

		const formErr = transformZodErrors(error as z.ZodError);
		expect(formErr).toEqual([
			{
				field: "nested.test",
				message: "String must contain at least 1 character(s)",
			},
		]);
	});
});
