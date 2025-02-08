import { z } from "zod";

export const envSchema = z.object({
	VITE_DB_FILE_PATH: z.string(),
	VITE_LOG_LEVEL: z.string(),
	VITE_GH_OWNER: z.string(),
	VITE_GH_TOKEN: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
