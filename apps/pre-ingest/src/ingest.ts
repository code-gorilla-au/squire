import type { Logger } from "pino";
import type { ProductService } from "products";
import { IngestErrors } from "./models";
import { ProductExistsError } from "products/src/errors";

export class IngestService {
	private log: Logger;
	private productService: ProductService;

	constructor(log: Logger, productService: ProductService) {
		this.log = log.child({ package: "pre-ingest" });
		this.productService = productService;
	}

	/**
	 * Ingest topics into the product database
	 * @param topics list of topics to ingest
	 */
	async ingest(topics: string[]) {
		this.log.info("Creating products...");
		await this.createProductsByTopics(topics);

		this.log.info("Syncing products...");
		await this.sync();
	}

	/**
	 * Create products for each topic. If a product already exists for a topic, it will be skipped.
	 * @param topics list of topics to create products
	 */
	private async createProductsByTopics(topics: string[]) {
		const errList: Error[] = [];

		for (const topic of topics) {
			try {
				this.log.debug("Creating product for topic", topic);
				await this.productService.createProduct(topic, [topic]);
			} catch (error) {
				const err = error as Error;
				if (err instanceof ProductExistsError) {
					this.log.warn({ topic }, "Product already exists, skipping...");
					continue;
				}

				this.log.warn({ error: err.message }, "Error creating product");
				errList.push(err);
			}
		}

		if (errList.length > 0) {
			this.log.error("Error creating products");
			throw new IngestErrors(errList);
		}
	}

	/**
	 * Sync products with the GitHub API
	 */
	private async sync() {
		const syncErrs = await this.productService.syncProducts();

		if (syncErrs.length > 0) {
			this.log.error("Sync errors occurred");
			throw new IngestErrors(syncErrs);
		}
	}
}
