import pino from "pino";
import pinoCaller from "pino-caller";

const base = pino({ level: process.env.LOG_LEVEL ?? "info" });

export const logger = pinoCaller(base);
