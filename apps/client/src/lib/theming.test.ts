import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { useTheme, type ThemeSwitcher } from "./theming";
import { get } from "svelte/store";

vi.mock("$app/environment", (original) => {
	return {
		...original,
		browser: true,
	};
});

describe("theming", () => {
	let theme: ThemeSwitcher;
	const mockMatchMedia = vi.fn();

	beforeAll(() => {
		vi.stubGlobal("matchMedia", mockMatchMedia);
	});

	beforeEach(() => {
		mockMatchMedia.mockReturnValue({ matches: false });

		theme = useTheme();
	});

	afterEach(() => {
		theme.reset();
	});

	afterAll(() => {
		vi.unstubAllGlobals();
	});

	it("should return init theme if non is set", () => {
		expect(get(theme.currentTheme)).toBe("light");
	});

	it("should return preferred theme as dark", () => {
		mockMatchMedia.mockImplementation(() => ({ matches: true }));
		const darkTheme = useTheme();

		expect(get(darkTheme.currentTheme)).toBe("dark");
	});
	it("should set dark theme if stored in localStorage", () => {
		localStorage.setItem("--theme", "dark");
		const darkTheme = useTheme();
		expect(get(darkTheme.currentTheme)).toBe("dark");
	});
});
