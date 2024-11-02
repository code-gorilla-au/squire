const THEME_STORAGE_KEY = "--theme";
export type Theme = "dark" | "light";

/**
 * media query for dark mode
 */
const darkMediaQuery = "(prefers-color-scheme: dark)";

/**
 * in memory store for the current theme
 */
let currentTheme: Theme | undefined = undefined;

/**
 * gets the current theme for the user based on their preference or saved theme
 */
export function useTheme(): Theme {
	if (currentTheme) {
		return currentTheme;
	}

	console.log("useTheme", window.matchMedia(darkMediaQuery).matches);

	const prefersDark = window.matchMedia(darkMediaQuery).matches;

	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? "";
	if (typeTheme(storedTheme)) {
		currentTheme = storedTheme;
		setColourScheme(storedTheme);
		return currentTheme;
	}

	currentTheme = "light";
	if (prefersDark) {
		currentTheme = "dark";
	}

	setColourScheme(currentTheme);
	return currentTheme;
}

/**
 * saves the theme to local storage
 * @param theme theme to save
 */
export function saveTheme(theme: Theme): void {
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
export function resetTheme() {
	currentTheme = undefined;
}
