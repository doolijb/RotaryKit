import type { FormSchema } from "$shared/validation/base"
import type { RequestEvent } from "@sveltejs/kit"

/**
 * Helper function to validate the form data and automatically throw an error if there are any errors
 */
export async function validateData<T extends FormSchema["Data"] = {[key: string]: any}>({ 
	form, 
	event, 
}: {
	form: FormSchema,
	event: RequestEvent,
}) {

	/**
	 * Get the data
	 */
	const data: T = await event.request.json()

	/**
	 * Validate the data
	 */
	const errors: FormErrors = await form.validate({data})

	/**
	 * Return the errors
	 */
	return { data, errors }
}