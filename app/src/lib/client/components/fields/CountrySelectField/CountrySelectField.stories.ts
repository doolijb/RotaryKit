import Component from "."
import baseMeta from "@components/fields/BasicSearchSelectField/BasicSearchSelectField.stories"
import type {Meta} from "@storybook/svelte"
import type {ComponentType} from "svelte"


const meta: Meta<typeof Component> = {
    component: Component as ComponentType,
    tags: ["autodocs"],
    decorators: [],
    argTypes: {
        ...baseMeta.argTypes
    }
}

export default meta

const Template = (args: {value: boolean}) => ({
    Component,
    props: args
})

export const Default = {
    render: Template,
    args: {
        // Component Props Here
    }
}

export const Disabled = {
    render: Template,
    args: {
        disabled: true
    }
}

export const WithValue = {
    render: Template,
    args: {
        value: "US"
    }
}
