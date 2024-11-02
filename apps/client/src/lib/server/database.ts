import { Database, OPEN_READWRITE } from "duckdb-async";
import { loadConfig } from "../env";

const config = loadConfig();

export const db = await Database.create(config.dbFilePath, OPEN_READWRITE);
