import { envSchema, type EnvSchema } from "./models";

/**
 * Load the environment variables and validate them.
 */
export function loadConfig(): EnvSchema {
	const env = {
		VITE_DB_FILE_PATH: import.meta.env.VITE_DB_FILE_PATH,
		VITE_GH_OWNER: import.meta.env.VITE_GH_OWNER,
		VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
		VITE_GH_TOKEN: import.meta.env.VITE_GH_TOKEN,
	};

	return envSchema.parse(env);
}
