// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ProductService } from "products";

// for information about these interfaces
declare global {
	// biome-ignore lint/style/noNamespace: <explanation>
	namespace App {
		// interface Error {}
		interface Locals {
			productService: ProductService;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
