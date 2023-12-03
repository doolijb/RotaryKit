import { error } from "@requests"

/**
 * Returns a forbidden error. Useful for logged out users.
 * 
 * @example:
 * if (!event.locals.user) {
 * 		return unauthorizedError()
 * }
 */
export default function unauthorizedError (
	message: string = "Please log in to continue.",
	status=401
) {
	return error(status, {
		message
	})
}