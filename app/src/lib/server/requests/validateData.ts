import { error } from "$requests"
import type { FormSchema } from "$validation/base"

/**
 * Helper function to validate the form data and automatically throw an error if there are any errors
 */
export async function validateData({ 
	form, 
	event, 
}: {
	form: FormSchema,
	event: RequestEvent,
}): Promise<FormErrors> {

	/**
	 * Get the data
	 */
	const data = await event.body.json()

	/**
	 * Validate the data
	 */
	const errors: FormErrors = await form.validate({data})

	/**
	 * Return the errors
	 */
	return errors
}