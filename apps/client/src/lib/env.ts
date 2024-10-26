import { z } from "zod";
import { env } from "bun";

const serverSchema = z.object({
	dbFilePath: z.string(),
	logLevel: z.string(),
});

export type WorkerConfig = z.infer<typeof serverSchema>;

export function loadConfig() {
	const dbFilePath = env.DB_FILE_PATH ?? "memory";
	const logLevel = env.LOG_LEVEL ?? "info";

	return serverSchema.parse({
		dbFilePath,
		logLevel,
	});
}
