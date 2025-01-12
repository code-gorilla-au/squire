import { Database, OPEN_READWRITE } from "duckdb-async";

export async function initDB(filePath: string) {
	return await Database.create(filePath, OPEN_READWRITE);
}
