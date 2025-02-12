import { describe, it, expect } from "vitest";
import { ComplexForm } from "./forms.svelte";

describe("complex forms", () => {
	it("should render the base form with initial values", () => {
		const form = new ComplexForm({
			startDate: new Date(),
			endDate: new Date(),
			allowDependabot: true,
			allowSecurity: true,
			chores: {
				dependabot: [],
				security: [],
			},
		});
		expect(form.data).toEqual({ name: "John", age: 30 });
	});
});
