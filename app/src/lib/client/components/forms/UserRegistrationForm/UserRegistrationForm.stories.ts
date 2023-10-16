import type { ComponentType } from "svelte"
import {faker} from "@faker-js/faker"

import type { Meta } from "@storybook/svelte"

import Component from "."

const meta: Meta<typeof Component> = {
    argTypes: {} as any,
    component: Component as ComponentType,
    decorators: [],
    tags: ["autodocs"]
}

export default meta

const Template = (args: {value: boolean}) => ({
    Component,
    props: args
})

export const Default = {
    args: {},
    render: Template
}

export const Filled = {
    args: {
        formData: {
            email: faker.internet.email(),
            passphrase: "This is a valid passphrase$",
            passphraseConfirm: "This is a valid passphrase$",
        }
    },
    render: Template
}

export const WithErrors = {
    args: {
        formData: {
            email: "bad@email",
            passphrase: "some passphrase",
            passphraseConfirm: "does not match",
        },
    },
}