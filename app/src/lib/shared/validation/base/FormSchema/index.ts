import deepmerge from "deepmerge"
import type { Primitive } from "../Primitive"
import { children as c } from "$validation/validators"
// import { browser } from "$app/environment"

type FieldAttributes = () => {
    label?: string
    placeholder?: string
    defaultValue?: any
}

export class FormSchema {
    fields: Record<string, Primitive<unknown>>
    optional: Record<string, boolean>
    fieldAttributes: {
        [key in keyof this["fields"]]?: FormFieldAttributes
    }
    Data: FormDataOf<this> = null

    static init() {
        const form = new this()
        const required = c.Required.init()
        Object.entries(form.fields).forEach(([key, field]) => {
            if (!form.optional[key]) {
                field.addValidator(required)
            }
        })
        // // Dev only server side validation
        // if (!import.meta.env.PROD && this.fieldAttributes) {
        //     const missingField = Object.keys(this.fieldAttributes).find((key) => {
        //         return !(key in this.fields)
        //     })
        //     if (missingField) {
        //         throw new Error(`Field "${missingField}" is missing from fields, but is present in fieldAttributes.`)
        //     }
        // }
        // Try to save some server side memory
        // if (!browser) {
        //     delete(this.fieldAttributes)
        // }
        return form
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