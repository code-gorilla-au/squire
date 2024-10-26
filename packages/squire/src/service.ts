import type { Store } from "./interfaces";
import { logger } from "toolbox";

export function initService(store: Store) {
	return {
		async createProduct(name: string, tags: string[]): Promise<void> {
			const result = await store.insertProduct(name, tags);

			if (result.error) {
				logger.error({ error: result.error }, "Error creating product");
				throw new Error("error creating product");
			}
		},
	};
}
