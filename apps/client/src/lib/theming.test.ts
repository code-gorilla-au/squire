import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./theming";

describe("theming", () => {
	const mockMatchMedia = vi.fn().mockImplementation(() => {
		return {
			matches: false,
			value: vi.fn().mockImplementation(() => ({
				matches: false,
			})),
		};
	});

	beforeEach(() => {
		vi.stubGlobal("matchMedia", mockMatchMedia);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should return init theme if non is set", () => {
		const theme = useTheme();
		expect(theme).toBe("light");
	});
	it("should return preferred theme as dark", () => {
		mockMatchMedia.mockImplementation(() => {
			return {
				matches: true,
				value: vi.fn().mockImplementation(() => ({
					matches: true,
				})),
			};
		});
		expect(useTheme()).toBe("dark");
	});
});
