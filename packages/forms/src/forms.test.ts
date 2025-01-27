import { describe, expect, it } from "vitest";
import { z } from "zod";
import { formFromRequest, transformZodErrors } from "./forms";

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

describe("formFromRequest", () => {
	it("should return an object from a form data", async () => {
		const formData = new FormData();
		formData.append("test", "test");

		const req = new Request("http://google.com", {
			method: "POST",
			body: formData,
		});

		const form = await formFromRequest(req);
		expect(form).toEqual({
			test: "test",
		});
	});
});
