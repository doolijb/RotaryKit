import deepmerge from "deepmerge"
import type { Primitive } from "../Primitive"
import * as v from "$shared/validation/validators"
import { browser } from "$app/environment"
import { ValidStates } from "$shared/constants"
import { getContext, setContext } from "svelte"
import { v4 as uuidv4 } from "uuid"

type FormContext = {
	data: Record<string, unknown>
	errors: FormErrors
	validStates: Record<string, typeof ValidStates.Options>
	touchedFields: Record<string, boolean>
	meta: {
		disabled?: boolean
		canSubmit?: boolean
	} & Record<string, any>
}

export class FormSchema {
	fields: Record<string, Primitive<unknown>>
	optional: Record<string, boolean>
	fieldAttributes: {
		[key in keyof this["fields"]]?: FormFieldAttributes
	}
	Data: FormDataOf<this>
	contextName: string

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected constructor() {}

	static init({data = {}}: { data?: Record<string, any> } = {}): FormSchema {
		const form = new this()
		const required = v.children.Required.init()
		Object.entries(form.fields).forEach(([key, field]) => {
			if (!form.optional[key]) {
				field.addValidator(required)
			}
		})

		if (browser) {
			form.contextName = `form:${uuidv4()}`
			const errors = {} as FormErrors
			const validStates = {} as Record<string, typeof ValidStates.Options>
			const touchedFields = {} as Record<string, boolean>
			const meta: Record<string, any> = {
				disabled: false,
				canSubmit: true
			}
			Object.entries(form.fields).forEach(([key, field]) => {
				touchedFields[key] = false
				validStates[key] = ValidStates.NONE
				if (data[key] === undefined) {
					switch (true) {
						case field instanceof v.Array:
							data[key] = []
							break
						case field instanceof v.Boolean:
							data[key] = false
							break
						case field instanceof v.Number:
							data[key] = 0
							break
						case field instanceof v.String:
							data[key] = ""
							break
						default:
							throw new Error(`Unknown primitive for field ${key}`)
					}
				}
			})
			const ctx: FormContext = $state({
				data,
				errors,
				validStates,
				touchedFields,
				meta,
			})
			setContext(form.contextName, ctx)
		}
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

	getContext(): FormContext {
		return getContext(this.contextName)
	}
}
