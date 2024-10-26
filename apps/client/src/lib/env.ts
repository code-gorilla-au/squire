import { join } from "node:path";
import { logger } from "toolbox";
import { z } from "zod";

const dbFilePath =
	join(
		import.meta.dirname,
		"..",
		"..",
		"..",
		"..",
		import.meta.env.VITE_DB_FILE_PATH,
	) ?? ":memory:";
const logLevel = import.meta.env.vITE_LOG_LEVEL ?? "debug";

const serverSchema = z.object({
	dbFilePath: z.string(),
	logLevel: z.string(),
});

export type WorkerConfig = z.infer<typeof serverSchema>;

export function loadConfig() {
	logger.info({ dbFilePath, logLevel }, "Loaded configuration");

	return serverSchema.parse({
		dbFilePath,
		logLevel,
	});
}