import { error } from "@requests"

/**
 * Helper function to validate the form data and automatically throw an error if there are any errors
 */
export default async function validateForm({ 
	form, 
	data, 
	throwError=true 
}): Promise<FormErrors> {
	/**
	 * Validate the data
	 */
	const errors: FormErrors = await form.test(data)

	/**
	 * Throw an error if there are any errors
	 * and throwError is true
	 */
	if (throwError && Object.entries(errors).length > 0) {
		throw error(400, {
			errors
		})
	}

	/**
	 * Return the errors
	 */
	return errors
}