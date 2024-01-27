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
        data: {
            username: "jack_sparrow",
            email: "jack.sparrow@example.com",
            passphrase: "Th1s is a valid passphrase$",
            passphraseConfirm: "Th1s is a valid passphrase$",
        }
    },
    render: Template
}

export const WithErrors = {
    args: {
        data: {
            username: "jack.sparrow",
            email: "jack.sparrow@example",
            passphrase: "Th1s is a valid passphrase",
            passphraseConfirm: "Th1s is a valid passphrase$",
        }
    },
}