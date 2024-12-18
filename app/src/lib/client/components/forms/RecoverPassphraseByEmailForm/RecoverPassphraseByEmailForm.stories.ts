import type { ComponentType } from "svelte"
import { faker } from "@faker-js/faker"

import type { Meta } from "@storybook/svelte"

import Component from "."

const meta: Meta<typeof Component> = {
	argTypes: {} as any,
	component: Component as ComponentType,
	decorators: [],
	tags: ["autodocs"]
}

export default meta

export const Default = {
	args: {}
}

export const Filled = {
	args: {
		...Default.args,
		data: {
			email: "jack.sparrow@example.com"
		}
	}
}
