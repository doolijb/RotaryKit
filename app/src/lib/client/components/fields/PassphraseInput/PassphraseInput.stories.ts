import Component from "."
import { validators as v } from "$validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"
import { FormSchema } from "$validation/base"
import { faker } from "@faker-js/faker"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
    decorators: [],
}

export default meta

class DefaultForm extends FormSchema {
    fields = {
        passphrase: v.String.init(),
    }
    optional = {passphrase: true}
    fieldAttributes = {
        passphrase: {
            label: "Passphrase",
        }
    }
}

export const Default = {
    args: {
        field: "passphrase",
        form: DefaultForm.init(),
        data: { passphrase: "" },
        errors: {},
    }
}

export const Disabled = {
    args: {
        ...Default.args,
        data: { passphrase: faker.internet.password()},
        disabled: true,
    }
}

export const Filled = {
    args: {
        ...Disabled.args,
        disabled: false,
    }
}

class WithValidatorsForm extends FormSchema {
    fields = {
        passphrase: v.String.init().lowerCaseIncluded().upperCaseIncluded().minLength({minLen:10}).maxLength({maxLen:100}).specialCharIncluded(),
    }
    optional = {}
    fieldAttributes = {
        passphrase: {
            label: "Passphrase",
            description: "Provide a secure password to access your account, you may use spaces and special characters to create a complex phrase."
        }
    }
}

export const FilledWithValidators = {
    args: {
        form: WithValidatorsForm.init(),
        field: "passphrase",
        data: {passphrase: faker.internet.password()},
        errors: {}
    }
}

export const WithValidators = {
    args: {
        form: WithValidatorsForm.init(),
        field: "passphrase",
        data: {passphrase: ""},
        errors: {}
    }
}

export const WithPlaceholder = {
    args: {
        ...Default.args,
        placeholder: "Enter a passphrase..."
    }
}