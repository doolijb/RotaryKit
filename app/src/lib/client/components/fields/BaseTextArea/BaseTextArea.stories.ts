import Component from "."
import type { Meta } from "@storybook/svelte"
import { maxLengthValidator, requiredValidator } from "@validators"
import type { ComponentType } from "svelte"

const meta: Meta<typeof Component> = {
    argTypes: {},
    component: Component as ComponentType,
    decorators: [],
    tags: ["autodocs"]
}

export default meta

const Template = (args: { value: boolean }) => ({
    Component,
    props: args
})

export const Example = {
    args: {
        // Component Props Here
    },
    render: Template
}

export const WithValidators = {
    args: {
        validators: [
            validators.required(),
            maxLengthValidator({ maxLen: 100 })
        ]
    },
    render: Template
}