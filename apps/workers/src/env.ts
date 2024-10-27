import { env } from "bun";
import { z } from "zod";

const workersSchema = z.object({
	ghToken: z.string(),
	ghOwner: z.string(),
	dbFilePath: z.string(),
	logLevel: z.string(),
});

export type WorkersConfig = z.infer<typeof workersSchema>;

export function loadConfig() {
	const ghToken = env.GH_TOKEN;
	const ghOwner = env.GH_OWNER;
	const dbFilePath = env.DB_FILE_PATH ?? "memory";
	const logLevel = env.LOG_LEVEL ?? "info";

	return workersSchema.parse({
		ghToken,
		ghOwner,
		dbFilePath,
		logLevel,
	});
}
