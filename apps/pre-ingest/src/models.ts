import { z } from "zod";

export const envSchema = z.object({
	VITE_DB_FILE_PATH: z.string(),
	VITE_LOG_LEVEL: z.string(),
	VITE_GH_OWNER: z.string(),
	VITE_GH_TOKEN: z.string(),
	TOPICS_TO_INGEST: z.array(z.string()),
});

export type EnvSchema = z.infer<typeof envSchema>;

export class IngestErrors extends Error {
	public readonly errors: Error[];

	constructor(errors: Error[]) {
		super("Ingest errors occurred");
		this.errors = errors;
		this.message = this.errors.map((e) => e.message).join("\n");
	}
}
