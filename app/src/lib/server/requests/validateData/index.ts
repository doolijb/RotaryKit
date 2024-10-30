import type { FormSchema } from "$shared/validation/base"
import type { RequestEvent } from "@sveltejs/kit"

/**
 * Normalize the form data into a key-value object
 */
function formDataToObject(formData: FormData): Record<string, any> {
	const obj: Record<string, any> = {}

	formData.forEach((value, key) => {
		// Remove the [] suffix from the key if it exists
		const cleanKey = key.endsWith("[]") ? key.slice(0, -2) : key

		// Ensure obj[cleanKey] is an array if key ends with []
		if (key.endsWith("[]")) {
			if (!obj[cleanKey]) {
				obj[cleanKey] = []
			}
			obj[cleanKey].push(value)
		} else {
			// Check if the key already exists
			if (obj[cleanKey]) {
				// If the key exists and is not an array, convert it to an array
				if (!Array.isArray(obj[cleanKey])) {
					obj[cleanKey] = [obj[cleanKey]]
				}
				// Append the new value to the array
				obj[cleanKey].push(value)
			} else {
				// If the key does not exist, add it to the object
				obj[cleanKey] = value
			}
		}
	})

	return obj
}

/**
 * Check request type and convert data if necessary
 */
async function extractData(request: RequestEvent["request"]) {
	// check if request is json or multipart
	if (request.headers.get("content-type")?.includes("multipart/form-data")) {
		const formData = await request.formData()
		const data = formDataToObject(formData)
		return data
	} else {
		const data = await request.json()
		return data
	}
}

/**
 * Helper function to validate the form data and automatically throw an error if there are any errors
 */
export async function validateData<T extends FormSchema["Data"] = { [key: string]: any }>({
	form,
	event
}: {
	form: FormSchema
	event: RequestEvent
}) {
	/**
	 * Get the data
	 */
	const data: T = await extractData(event.request)

	/**
	 * Validate the data
	 */
	const errors: FormErrors = await form.validate({ data })

	/**
	 * Return the errors
	 */
	return { data, errors }
}
