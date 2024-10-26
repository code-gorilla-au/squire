import type { Store } from "./interfaces";
import { logger } from "toolbox";
import type { ProductDto } from "./models";

export function initService(store: Store) {
	return {
		async createProduct(name: string, tags: string[]): Promise<void> {
			const result = await store.insertProduct(name, tags);

			if (result.error) {
				logger.error({ error: result.error }, "Error creating product");
				throw new Error("error creating product");
			}
		},
		async getAllProducts(): Promise<ProductDto[]> {
			const results = await store.getAllProducts();

			if (results.error) {
				logger.error({ error: results.error }, "Error fetching products");
				throw new Error("error fetching products");
			}

			logger.info({ totalProducts: results.data?.length }, "Fetched products");

			const products: ProductDto[] = {
				...(results.data as ProductDto[]),
			};

			return products;
		},
	};
}
