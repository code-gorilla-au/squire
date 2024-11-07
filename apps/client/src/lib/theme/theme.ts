import { browser } from "$app/environment";
import { type Readable, get, readable, readonly, writable } from "svelte/store";

const THEME_STORAGE_KEY = "--theme";

export type Theme = "dark" | "light";

export type ThemeSwitcher = {
	currentTheme: Readable<Theme>;
	update: (theme: Theme) => void;
	reset: () => void;
};

/**
 * media query for dark mode
 */
const darkMediaQuery = "(prefers-color-scheme: dark)";

/**
 * in memory store for the current theme
 */
const current = writable<Theme>("light");

/**
 * gets the current theme for the user based on their preference or saved theme
 */
export function useTheme(): ThemeSwitcher {
	if (!browser) {
		return {
			currentTheme: readable("light"),
			update: (_: Theme) => {
				// do nothing
			},
			reset: () => {
				// do nothing
			},
		};
	}

	const prefersDark = window.matchMedia(darkMediaQuery).matches;

	if (prefersDark) {
		current.set("dark");
	}

	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? "";
	if (typeTheme(storedTheme)) {
		current.set(storedTheme);
	}

	setColourScheme(get(current));

	return {
		currentTheme: readonly(current),
		update: (theme: Theme) => {
			current.set(theme);
			setColourScheme(theme);
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		},
		reset: () => {
			current.set("light");
		},
	};
}

/**
 * checks if value is a possible theme value
 * @param value possible theme value
 */
function typeTheme(value: string): value is Theme {
	return ["dark", "light"].includes(value);
}

function setColourScheme(theme: Theme) {
	if (!browser) {
		return;
	}

	if (theme === "dark") {
		document.documentElement.classList.add("dark");
		return;
	}

	document.documentElement.classList.remove("dark");
}
