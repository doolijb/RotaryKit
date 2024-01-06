import deepmerge from "deepmerge"
import type { Primitive } from "../Primitive"
import { children as c } from "$validation/validators"

export abstract class FormSchema {
    abstract fields: Record<string, Primitive<unknown>>
    abstract optional: Record<string, boolean>
    Data: FormDataOf<this> = null

    constructor() {
        const required = new c.Required()
        Object.entries(this["fields"]).forEach(([key, field]) => {
            if (!this["optional"][key]) {
                field.addValidator(required)
            }
        })
    }

    async validate({data}:{data: Record<string, unknown>}): Promise<FormErrors> {
        const errors: FormErrors = {}
        Object.keys(this.fields).forEach((key) => {
            errors[key] = {}
        })

        await Promise.all(Object.keys(this.fields).map(async (key) => {
            const field = this.fields[key]
            const result = await field.validate({key, data})
            if (Object.keys(result).length ) {
                errors[key] = deepmerge(errors[key], result)
            }
        }))

        // Remove any fields from errors that have no errors
        Object.keys(errors).forEach((key) => {
            if (!Object.keys(errors[key]).length) {
                delete errors[key]
            }
        })

        return errors
    }
}