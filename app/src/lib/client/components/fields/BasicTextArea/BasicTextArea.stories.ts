import { faker } from "@faker-js/faker"
import Component from "."
import type { Meta } from "@storybook/svelte"
import { validators as v, utils, fields } from "@validation"
import type { ComponentType } from "svelte"

const meta: Meta<typeof Component> = {
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
        resizeX: {
            type: {
                name: "boolean",
                required: false
            }
        },
        resizeY: {
            type: {
                name: "boolean",
                required: false
            }
        },
        rows: {
            type: {
                name: "number",
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
    } as any,
    component: Component as ComponentType,
    decorators: [],
    tags: ["autodocs"]
}

export default meta

const Template = (args: { value: boolean }) => ({
    Component,
    props: args
})

export const Default = {
    render: Template,
    args: {
        fieldValidator: utils.fieldValidator({
            definition: fields.plain,
        }),
    }
}

export const Disabled = {
    render: Template,
    args: {
        value: faker.lorem.lines(10),
        disabled: true,
        fieldValidator: utils.fieldValidator({
            definition: fields.plain,
        }),
    }
}

export const Filled = {
    render: Template,
    args: {
        value: faker.lorem.lines(10),
        fieldValidator: utils.fieldValidator({
            definition: fields.plain,
        }),
    }
}

export const FilledWithValidators = {
    render: Template,
    args: {
        value: faker.lorem.lines(10),
        fieldValidator: utils.fieldValidator({
            definition: {
                required: {
                    validator: v.required
                },
                minLength: {
                    validator: v.minLength,
                },
                maxLength: {
                    validator: v.maxLength,
                },
            }
        }),
    }
}

export const WithValidators = {
    render: Template,
    args: {
        fieldValidator: utils.fieldValidator({
            definition: {
                required: {
                    validator: v.required
                },
                minLength: {
                    validator: v.minLength,
                },
                maxLength: {
                    validator: v.maxLength,
                },
            }
        }),
    }
}