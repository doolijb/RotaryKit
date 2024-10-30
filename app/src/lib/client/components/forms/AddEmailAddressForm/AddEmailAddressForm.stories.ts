import type { ComponentType } from "svelte"

import type { Meta } from "@storybook/svelte"

import Component from "."

const meta: Meta<typeof Component> = {
	argTypes: {} as any,
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
	args: {},
	render: Template
}

export const Filled = {
	args: {
		data: {
			email: "jack.sparrow@example.com"
		}
	},
	render: Template
}

export const WithErrors = {
	args: {
		data: {
			email: "jack.sparrow@example"
		}
	}
}
