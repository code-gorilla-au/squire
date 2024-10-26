import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { type UserConfig, loadEnv } from "vite";

export default function config({ mode }: UserConfig) {
	process.env = {
		...process.env,
		...loadEnv(mode ?? "development", "../../"),
	};
	return defineConfig({
		plugins: [sveltekit()],

		test: {
			include: ["src/**/*.{test,spec}.{js,ts}"],
		},
	});
}
