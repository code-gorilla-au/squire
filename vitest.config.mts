import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [svelteTesting()],
	test: {
		include: ["**/*.{test,spec}.{js,ts}"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
	},
});
