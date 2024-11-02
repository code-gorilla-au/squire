import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { type UserConfig, loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default function config({ mode }: UserConfig) {
	process.env = {
		...process.env,
		...loadEnv(mode ?? "development", "../../"),
	};
	return defineConfig({
		plugins: [sveltekit(), svelteTesting()],

		test: {
			include: ["src/**/*.{test,spec}.{js,ts}"],
			environment: "jsdom",
			setupFiles: ["./vitest.setup.ts"],
		},
	});
}
