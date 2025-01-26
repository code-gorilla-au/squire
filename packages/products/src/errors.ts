export class ProductExistsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ProductExistsError";
	}
}

export class ProductNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ProductNotFoundError";
	}
}
