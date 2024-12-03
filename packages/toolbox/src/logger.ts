import pino from "pino";
import pinoCaller from "pino-caller";

// const base = pino({ level: import.meta.env.LOG_LEVEL ?? "info" });
const base = pino({ level: "debug" });

export const logger = pinoCaller(base);
