import Component from "."
import {faker} from "@faker-js/faker"
import type {Meta} from "@storybook/svelte"

const meta: Meta<typeof Component> = {
    component: Component as any,
    tags: ["autodocs"],
    argTypes: {}
}

export default meta

const Template = ({...args}) => ({
    Component,
    props: args
})

export const Default = Template.bind({})

Default.args = {
    username: faker.internet.userName(),
    url: faker.internet.url(),
    subject: faker.lorem.sentence(),
}

export const WithExpiration = Template.bind({})

WithExpiration.args = { 
    ...Default.args,
    expiresAt: faker.date.future().toISOString(),
}