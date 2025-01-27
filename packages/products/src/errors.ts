export class ProductExistsError extends Error {
	constructor(message: string) {
		super(message);
		this.message = `ProductExistsError: ${message}`;
		this.name = "ProductExistsError";
	}
}

export class ProductNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.message = `ProductNotFoundError: ${message}`;
		this.name = "ProductNotFoundError";
	}
}
