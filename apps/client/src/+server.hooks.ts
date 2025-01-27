import { initWorkers } from "$lib/server/workers";
import type { ServerInit } from "@sveltejs/kit";

export const init: ServerInit = () => {
	initWorkers();
};
