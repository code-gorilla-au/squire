import { env } from "bun";
import pino from "pino";

export const logger = pino({ level: env.LOG_LEVEL ?? "info" });
