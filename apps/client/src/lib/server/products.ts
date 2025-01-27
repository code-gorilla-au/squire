import { loadConfig } from "$lib/server/env";
import { initDB } from "database";
import { ProductRepository, ProductService } from "products";
import { initClient } from "squire-github";
import { logger } from "toolbox";

const config = loadConfig();
const client = initClient({
	ghToken: config.ghToken,
	defaultOwner: config.ghOwner,
});

const db = await initDB(config.dbFilePath);
const repo = new ProductRepository(db, logger);
await repo.initTables();

export const service = new ProductService(repo, logger, client);
service.syncProducts();
