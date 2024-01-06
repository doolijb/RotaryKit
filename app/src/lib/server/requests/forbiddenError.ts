import { error } from "$requests"

/**
 * Returns a forbidden error. Useful for insufficient permissions.
 * 
 * @example:
 * if (!user.isAdmin && !user.isSuperUser) {
 * 		throw forbiddenError()
 * } 
 */
export default function forbiddenError (
	message: string = "You do not have permission for this action.",
	status=403
) {
	return error(status, {
		message
	})
}