import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["packages/**/*.{test,spec}.{js,ts}"],
	},
});
