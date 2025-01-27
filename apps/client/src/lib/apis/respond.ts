import { json } from "@sveltejs/kit";
import {
	type ErrorResponseContext,
	STATUS_INTERNAL_SERVER_ERROR,
	STATUS_NOT_FOUND,
	statusText,
} from "./types";

/**
 * Respond server error
 * @param context optional additional context
 */
export function respondServerError(context?: ErrorResponseContext) {
	return json(
		{
			statusCode: STATUS_INTERNAL_SERVER_ERROR,
			title: statusText(STATUS_INTERNAL_SERVER_ERROR),
			detail: "Internal server error",
			context,
		},
		{ status: STATUS_INTERNAL_SERVER_ERROR },
	);
}

/**
 * Respond not found error
 * @param context optional additional context
 */
export function respondNotFound(context?: ErrorResponseContext) {
	return json(
		{
			statusCode: STATUS_NOT_FOUND,
			title: statusText(STATUS_NOT_FOUND),
			detail: "Resource not found",
			context,
		},
		{ status: STATUS_NOT_FOUND },
	);
}
