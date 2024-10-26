import { db } from "$lib/database";
import { initRepository, initService } from "squire";

const repo = initRepository(db);
export const service = initService(repo);
