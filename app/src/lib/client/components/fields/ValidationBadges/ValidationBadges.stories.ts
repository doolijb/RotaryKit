import Component from "."
import { validators as v } from "$validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
    decorators: [],
    argTypes: {
        validators: {
            type: {
                name: "array",
                required: false
            }
        },
        errors: {
            type: {
                name: "array",
                required: false
            }
        }
    } as any
}

export default meta

const Template = (args: { value: boolean }) => ({
    Component,
    props: args
})

const minLength = v.minLength({ minLen: 5 })
const required = v.required()

export const Multiple = {
    render: Template,
    args: {
        validators: [required, minLength],
        errors: [minLength]
    }
}

export const Sticky = {
    render: Template,
    args: {
        validators: [required]
    }
}

export const StickyError = {
    render: Template,
    args: {
        validators: [required],
        errors: [required]
    }
}
