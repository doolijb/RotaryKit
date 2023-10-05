import Component from "."
import { validators as v, utils, fields } from "@validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"


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
        errors: {
            type: {
                name: "array",
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

// export const Disabled = {
//     render: Template,
//     args: {
//         value: "Hello World",
//         disabled: true
//     }
// }

export const Empty = {
    render: Template,
    args: {
        // Component Props Here
        fieldValidator: utils.fieldValidator({
            definition: fields.plain,
        }),
    }
}

// export const Filled = {
//     render: Template,
//     args: {
//         value: "Hello World"
//     }
// }

// export const FilledWithValidators = {
//     render: Template,
//     args: {
//         value: "Hello World",
//         validators: [
//             v.required(),
//             v.minLength(),
//             v.maxLength(),
//             v.specialCharIncluded()
//         ]
//     }
// }

// export const WithPlaceholder = {
//     render: Template,
//     args: {
//         placeholder: "Enter your name"
//     }
// }

// export const WithValidators = {
//     render: Template,
//     args: {
//         validators: [
//             v.required(),
//             v.minLength(),
//             v.maxLength(),
//             v.specialCharIncluded()
//         ]
//     }
// }
