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
import { useTheme, type ThemeSwitcher } from "./theme";
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
	it("should set light theme if reset is called", () => {
		const resetTheme = useTheme();
		resetTheme.update("dark");
		resetTheme.reset();
		expect(get(resetTheme.currentTheme)).toBe("light");
	});
	it("should update to dark theme if update is called", () => {
		const updateTheme = useTheme();
		updateTheme.update("dark");
		expect(get(updateTheme.currentTheme)).toBe("dark");
	});
});
