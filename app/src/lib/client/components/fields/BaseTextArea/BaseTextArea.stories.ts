import Component from "."
import type { Meta } from "@storybook/svelte"
import { validators as v } from "@validation"
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
            v.required(),
            v.maxLength({ maxLen: 100 })
        ]
    },
    render: Template
}