import { error } from '@sveltejs/kit'
import type { IValidator, IFormValidatorSet } from '@interfaces'

export async function getRequestData(request: Request): Promise<{ [key: string]: string }> {
    let data: { [key: string]: string } = {}

    if (request.headers.get('content-type')?.includes('form')) {
        // Form Data
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                data[key] = value.trim()
            }
        }
    } else if (request.headers.get('content-type')?.includes('json')) {
        // JSON
        data = await request.json()
    } else {
        // Unhandled Content Type
        throw error(400, 'Invalid content type')
    }

    return data
}

export function validateData(data: { [key: string]: string }, formValidators: IFormValidatorSet) {
    const errors: { [key: string]: string[] } = {}

    // Validate each key in the data object
    Object.entries(data).forEach(([fieldName, value]) => {
        // All keys must exist in the validators object
        if (!formValidators[fieldName]) {
            // Make sure the errors object has a key for the given field
            if (errors[fieldName] === undefined) errors[fieldName] = []
            // Push an error message to the errors object
            errors[fieldName].push(`${fieldName} is an invalid field`)
        }

        // For each validator in the validators field
        Object.entries(formValidators[fieldName]).forEach(([validatorName, validator]) => {
            // If the validator returns false, push an error message to the errors object
            if (!validator.test(value)) {
                // Make sure the errors object has a key for the given field
                if (errors[fieldName] === undefined) errors[fieldName] = []
                // Push an error message to the errors object
                errors[fieldName].push(validator.message)
            }
        })
    })

    // If errors, throw an error
    if (Object.keys(errors).length) {
        throw error(
            400,
            { ...errors } as any
        )
    }
}