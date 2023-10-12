import Component from "."
import { validators as v, utils, fields } from "@validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"
import { faker } from "@faker-js/faker"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
    decorators: [],
    argTypes: {
        label: {
            type: {
                name: "string",
                required: false
            }
        },
        type: {
            type: {
                name: "string",
                required: false
            },
            control: {
                type: "select",
                options: ["text", "password", "email", "number"]
            }
        },
        fieldValidator: {
            type: {
                name: "object",
                required: true
            }
        },
        value: {
            type: {
                name: "string",
                required: false
            }
        },
        placeholder: {
            type: {
                name: "string",
                required: false
            }
        },
        disabled: {
            type: {
                name: "boolean",
                required: false
            }
        },
        fieldErrors: {
            type: {
                name: "object",
                required: false
            }
        },
        isTouched: {
            type: {
                name: "boolean",
                required: false
            }
        },
        onInput: {
            action: "onInput",
            table: {
                disable: true
            }
        },
        onFocus: {
            action: "onFocus",
            table: {
                disable: true
            }
        },
        onBlur: {
            action: "onBlur",
            table: {
                disable: true
            }
        }
    } as any
}

export default meta

const Template = (args: { value: boolean }) => ({
    Component,
    props: args
})

export const Default = {
    render: Template,
    args: {
        // Component Props Here
        fieldValidator: utils.fieldValidator({
            definition: fields.email,
        }),
    }
}

export const Disabled = {
    render: Template,
    args: {
        value: faker.internet.email(),
        disabled: true,
        fieldValidator: utils.fieldValidator({
            definition: fields.email,
        }),
    }
}

export const Filled = {
    render: Template,
    args: {
        value: faker.internet.email(),
        fieldValidator: utils.fieldValidator({
            definition: fields.email,
        }),
    }
}

export const FilledWithValidators = {
    render: Template,
    args: {
        value: faker.internet.email(),
        fieldValidator: utils.fieldValidator({
            definition: fields.email,
        })
    }
}

export const WithPlaceholder = {
    render: Template,
    args: {
        placeholder: "john.doe@example.com",
        fieldValidator: utils.fieldValidator({
            definition: fields.email,
        }),
    }
}
