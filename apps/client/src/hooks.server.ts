import { service } from "$lib/server/products";
import { initWorkers } from "$lib/server/workers";
import type { ServerInit, Handle } from "@sveltejs/kit";

export const init: ServerInit = () => {
	initWorkers();
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.productService = service;

	return await resolve(event);
};
