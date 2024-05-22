import Component from "."
import type { Meta } from "@storybook/svelte"
import { FormSchema } from "$shared/validation/base"
import { validators as v } from "$shared/validation"
import { faker } from "@faker-js/faker"


const meta: Meta<typeof Component> = {
    component: Component as any,
    tags: ["autodocs"],
    decorators: [],
}

export default meta

class DefaultForm extends FormSchema {
    fields = {
        textField: new v.String(),
    }
    optional = {"textField": true}
    fieldAttributes = {
        textField: {
            label: "Text Field",
        }
    }
}

export const Default = {
    args: {
        field: "textField",
        form: DefaultForm.init(),
        data: { textField: "" },
        errors: {},
    }
}

export const Disabled = {
    args: {
        ...Default.args,
        disabled: true,
        data: { textField: "Hello world" },
    }
}

export const Filled = {
    args: {
        ...Default.args,
        data: { textField: "Hello world" },
    }
}

class WithPlaceholderForm extends FormSchema {
    fields = {
        textField: new v.String(),
    }
    optional = {"textField": true}
    fieldAttributes = {
        textField: {
            label: "Text Field",
            placeholder: "Enter a comment here..."
        }
    }
}

export const WithPlaceholder = {
    args: {
        field: "textField",
        form: WithPlaceholderForm.init(),
        data: { textField: "" },
        errors: {},
    }
}

export const CustomRows = {
    args: {
        ...Default.args,
        rows: 10,
    }
}

export const Resizable = {
    args: {
        ...Default.args,
        resizeY: true,
    }
}

class WithValidatorsForm extends FormSchema {
    fields = {
        textField: v.String.init().minLength({minLen:3}).maxLength({maxLen: 50}),
    }
    optional = {}
    fieldAttributes = {
        textField: {
            label: "Text Field",
            description: "You can add additional information about how your users should fill out this field here."
        }
    }
}

export const WithValidators = {
    args: {
        field: "textField",
        form: WithValidatorsForm.init(),
        data: { textField: "" },
        errors: {},
    }
}

export const FilledWithValidators = {
    args: {
        ...WithValidators.args,
        data: { textField: faker.lorem.lines(2) },
    }
}