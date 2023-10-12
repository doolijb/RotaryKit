import Component from "."
import BasicTextInputMeta from "@components/fields/BasicTextInput/BasicTextInput.stories"
import {faker} from "@faker-js/faker"
import type {Meta} from "@storybook/svelte"
import type {ComponentType} from "svelte"


const meta: Meta<typeof Component> = {
    ...BasicTextInputMeta,
    component: Component as ComponentType
}

export default meta

const Template = (args: {value: boolean}) => ({
    Component,
    props: args
})

export const Empty = {
    render: Template,
    args: {}
}

export const Filled = {
    render: Template,
    args: {
        value: faker.internet.userName()
    }
}
