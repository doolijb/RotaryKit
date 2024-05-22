import Component from "."
import type { Meta } from "@storybook/svelte"
import { FormSchema } from "$shared/validation/base"
import { validators as v } from "$shared/validation"
import type { ComponentType } from "svelte"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
    decorators: [],
}

export default meta

class DefaultForm extends FormSchema {
    fields = {
        inputField: v.String.init(),
    }
    optional = {inputField: true}
    fieldAttributes = {
        inputField: {
            label: "Input Field",
        }
    }
}

export const Default = {
    args: {
        field: "inputField",
        form: DefaultForm.init(),
        data: { inputField: "" },
        errors: {},
    }
}

export const Disabled = {
    args: {
        disabled: true,
        field: "inputField",
        form: DefaultForm.init(),
        data: { inputField: "Hello world" },
        errors: {},
    }
}

export const Filled = {
    args: {
        field: "inputField",
        form: DefaultForm.init(),
        data: { inputField: "Hello world" },
        errors: {},
    }
}

class WithValidatorsForm extends FormSchema {
    fields = {
        inputField: v.String.init().minLength({minLen:3}).maxLength({maxLen: 10}),
    }
    optional = {}
    fieldAttributes = {
        inputField: {
            label: "Input Field",
            description: "You can add additional information about how your users should fill out this field here."
        }
    }
}

export const WithValidators = {
    args: {
        field: "inputField",
        form: WithValidatorsForm.init(),
        data: { inputField: "" },
        errors: {},
    }
}

export const FilledWithValidators = {
    args: {
        field: "inputField",
        form: WithValidatorsForm.init(),
        data: { inputField: "Hello world" },
        errors: {},
    }
}

class WithPlaceholderForm extends FormSchema {
    fields = {
        inputField: new v.String(),
    }
    optional = {}
    fieldAttributes = {
        inputField: {
            label: "Input Field",
            placeholder: "Enter your name",
        }
    }
}

export const WithPlaceholder = {
    args: {
        field: "inputField",
        form: WithPlaceholderForm.init(),
        data: { inputField: "" },
        errors: {},
    }
}

