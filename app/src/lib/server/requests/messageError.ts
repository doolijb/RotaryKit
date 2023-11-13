import { error } from "@requests"

/**
 * Helper function to create a custom field error to display a custom message on the client
 * for a property where no validator exists.
 * 
 * @example: customFieldError("username", "Taken", "This username is already registered")
 */
export default function messageError (message: string, status=400) {
	return error(status, {
		message
	})
}