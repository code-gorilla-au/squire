import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

import Tag from "./tag.test.svelte";

describe("title component", () => {
	it("should render the tag", () => {
		render(Tag);

		expect(screen.getByText("Test Tag")).toBeInTheDocument();
	});
	it("should match snapshot", () => {
		const { container } = render(Tag);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
