import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

import Title from "$components/title/title.test.svelte";

describe("title component", () => {
	it("should render the title", () => {
		render(Title);

		expect(screen.getByRole("heading")).toBeVisible();
	});
	it("should render the back button", () => {
		render(Title);
		expect(screen.getByRole("button")).toBeVisible();
	});
	it('heading should have the text "hello"', () => {
		render(Title);
		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});
});
