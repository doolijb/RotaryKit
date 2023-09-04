import deepmerge from "deepmerge"
import type { Primitive } from "../Primitive"
import { children as c } from "$shared/validation/validators"

export class FormSchema {
	fields: Record<string, Primitive<unknown>>
	optional: Record<string, boolean>
	fieldAttributes: {
		[key in keyof this["fields"]]?: FormFieldAttributes
	}
	Data: FormDataOf<this> = null

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected constructor() {}

	static init() {
		const form = new this()
		const required = c.Required.init()
		Object.entries(form.fields).forEach(([key, field]) => {
			if (!form.optional[key]) {
				field.addValidator(required)
			}
		})
		return form
	}

	async validate({ data }: { data: Record<string, unknown> }): Promise<FormErrors> {
		const errors: FormErrors = {}
		Object.keys(this.fields).forEach((key) => {
			errors[key] = {}
		})

		await Promise.all(
			Object.keys(this.fields).map(async (key) => {
				try {
					const field = this.fields[key]
					const result = await field.validate({ key, data })
					if (Object.keys(result).length) {
						errors[key] = deepmerge(errors[key], result)
					}
				} catch (error) {
					console.error(`Error validating field ${key}:`, error)
					errors[key] = { EXCEPTION: "An error occurred while validating this field." }
				}
			})
		)

		// Remove any fields from errors that have no errors
		Object.keys(errors).forEach((key) => {
			if (!Object.keys(errors[key]).length) {
				delete errors[key]
			}
		})

		return errors
	}
}
