export const HTTP_METHOD_GET = "GET";
export const HTTP_METHOD_POST = "POST";
export const HTTP_METHOD_DELETE = "DELETE";

export type HttpStatus =
	| 200
	| 204
	| 301
	| 302
	| 303
	| 400
	| 401
	| 403
	| 404
	| 405
	| 409
	| 500;
export const STATUS_OK: HttpStatus = 200;
export const STATUS_NO_CONTENT: HttpStatus = 204;
export const STATUS_MOVED_PERMANENTLY: HttpStatus = 301;
export const STATUS_FOUND: HttpStatus = 302;
export const STATUS_SEE_OTHER: HttpStatus = 303;
export const STATUS_BAD_REQUEST: HttpStatus = 400;
export const STATUS_UNAUTHORIZED: HttpStatus = 401;
export const STATUS_FORBIDDEN: HttpStatus = 403;
export const STATUS_NOT_FOUND: HttpStatus = 404;
export const STATUS_METHOD_NOT_ALLOWED: HttpStatus = 405;
export const STATUS_CONFLICT: HttpStatus = 409;
export const STATUS_INTERNAL_SERVER_ERROR: HttpStatus = 500;

export const STATUS_TEXT_OK = "ok";
export const STATUS_TEXT_NO_CONTENT = "no content";
export const STATUS_TEXT_MOVED_PERMANENTLY = "moved permanently";
export const STATUS_TEXT_FOUND = "found";
export const STATUS_TEXT_SEE_OTHER = "see other";
export const STATUS_TEXT_BAD_REQUEST = "bad request";
export const STATUS_TEXT_UNAUTHORISED = "unauthorised";
export const STATUS_TEXT_FORBIDDEN = "forbidden";
export const STATUS_TEXT_NOT_FOUND = "not found";
export const STATUS_TEXT_METHOD_NOT_ALLOWED = "method not allowed";
export const STATUS_TEXT_CONFLICT = "conflict";
export const STATUS_TEXT_INTERNAL_SERVER_ERROR = "internal server error";

export function statusText(status: HttpStatus): string {
	const repo = {
		[STATUS_OK]: STATUS_TEXT_OK,
		[STATUS_NO_CONTENT]: STATUS_TEXT_NO_CONTENT,
		[STATUS_MOVED_PERMANENTLY]: STATUS_TEXT_MOVED_PERMANENTLY,
		[STATUS_FOUND]: STATUS_TEXT_FOUND,
		[STATUS_SEE_OTHER]: STATUS_TEXT_SEE_OTHER,
		[STATUS_BAD_REQUEST]: STATUS_TEXT_BAD_REQUEST,
		[STATUS_UNAUTHORIZED]: STATUS_TEXT_UNAUTHORISED,
		[STATUS_FORBIDDEN]: STATUS_TEXT_FORBIDDEN,
		[STATUS_NOT_FOUND]: STATUS_TEXT_NOT_FOUND,
		[STATUS_METHOD_NOT_ALLOWED]: STATUS_TEXT_METHOD_NOT_ALLOWED,
		[STATUS_CONFLICT]: STATUS_TEXT_CONFLICT,
		[STATUS_INTERNAL_SERVER_ERROR]: STATUS_TEXT_INTERNAL_SERVER_ERROR,
	};
	return repo[status];
}

export const COOKIE_NAME_AUTH = "--auth-token";
export const HEADER_CORRELATION_ID = "x-correlation-id";
export const HEADER_CONTENT_TYPE = "Content-Type";
export const CONTENT_TYPE_APP_JSON = "application/json";

export interface ApiErrorResponse {
	statusCode: number;
	title: string;
	message: string;
	detail: string;
	errors?: ApiErrorContext[];
	[key: string]: ApiErrorContext;
}

/**
 * Error class wrapper for API error response object
 */
export class ApiError extends Error {
	title: string;
	message: string;
	detail: string;
	statusCode: number;
	errors?: ApiErrorContext;
	context: Record<string, unknown>;
	constructor(public readonly response: ApiErrorResponse) {
		super(response.message);
		const { title, message, detail, statusCode, errors, ...context } = response;
		this.title = title;
		this.message = message;
		this.detail = detail;
		this.statusCode = statusCode;
		this.errors = errors;
		this.context = context;
	}
}

export type ErrorResponseContext = Record<string, ApiErrorContext>;

export type ApiErrorContext =
	| string
	| string[]
	| number
	| number[]
	| boolean
	| object
	| object[]
	| undefined
	| null;

export function getErrorMessage({ errors }: ApiErrorResponse): string {
	return errors?.map((e) => e).join(". ") ?? "";
}
