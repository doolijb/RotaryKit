import Component from "."
import { validators as v, utils, fields } from "$validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"
import { FormSchema } from "$validation/base"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
}

export default meta

const Template = (args: { value: boolean }) => ({
    Component,
    props: args
})

class DefaultForm extends FormSchema {
    fields = {
        checkboxField: new v.String(),
    }
    optional = {"checkboxField": true}
    fieldAttributes = {
        checkboxField: {
            label: "Checkbox Field",
        }
    }
}

export const Default = {
    args: {
        field: "checkboxField",
        form: DefaultForm.init(),
        data: { checkboxField: false },
        errors: {},
    }
}

export const Checked = {
    args: {
        field: "checkboxField",
        form: DefaultForm.init(),
        data: { checkboxField: true },
        errors: {},
    }
}

class WithValidatorsForm extends FormSchema {
    fields = {
        checkboxField: v.Boolean.init().truthy()
    }
    optional = {}
    fieldAttributes = {
        checkboxField: {
            label: "Checkbox Field",
            description: "You can add additional information about how your users should fill out this field here."
        }
    }
}

export const WithValidators = {
    args: {
        field: "checkboxField",
        form: WithValidatorsForm.init(),
        data: { checkboxField: false },
        errors: {},
    }
}