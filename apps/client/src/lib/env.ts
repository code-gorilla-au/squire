import { logger } from "toolbox";
import { z } from "zod";

const serverSchema = z.object({
	dbFilePath: z.string(),
	logLevel: z.string(),
});

export type WorkerConfig = z.infer<typeof serverSchema>;

export function loadConfig() {
	const dbFilePath = process.env.DB_FILE_PATH ?? ":memory:";
	const logLevel = process.env.LOG_LEVEL ?? "info";

	logger.info({ dbFilePath, logLevel }, "Loaded configuration");

	return serverSchema.parse({
		dbFilePath,
		logLevel,
	});
}
