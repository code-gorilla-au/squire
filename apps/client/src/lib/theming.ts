import { browser } from "$app/environment";

const THEME_STORAGE_KEY = "--theme";

export type Theme = "dark" | "light";

export type ThemeSwitcher = {
	currentTheme: Theme;
	save: (theme: Theme) => void;
	reset: () => void;
};

/**
 * media query for dark mode
 */
const darkMediaQuery = "(prefers-color-scheme: dark)";

/**
 * in memory store for the current theme
 */
let currentTheme: Theme = "light";

/**
 * gets the current theme for the user based on their preference or saved theme
 */
export function useTheme() {
	if (!browser) {
		return {
			currentTheme: "light" as Theme,
			save: (_: Theme) => {
				// do nothing
			},
			reset: () => {
				// do nothing
			},
		};
	}

	const prefersDark = window.matchMedia(darkMediaQuery).matches;

	if (prefersDark) {
		currentTheme = "dark";
	}

	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? "";
	if (typeTheme(storedTheme)) {
		currentTheme = storedTheme;
	}

	setColourScheme(currentTheme);

	return {
		currentTheme,
		save: saveTheme,
		reset: resetTheme,
	};
}

/**
 * saves the theme to local storage
 * @param theme theme to save
 */
function saveTheme(theme: Theme): void {
	currentTheme = theme;
	setColourScheme(theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * checks if value is a possible theme value
 * @param value possible theme value
 */
function typeTheme(value: string): value is Theme {
	return ["dark", "light"].includes(value);
}

function setColourScheme(theme: Theme) {
	if (theme === "dark") {
		document.documentElement.classList.add("dark");
		return;
	}

	document.documentElement.classList.remove("dark");
}

/**
 * resets the current theme
 */
function resetTheme() {
	currentTheme = "light";
}
