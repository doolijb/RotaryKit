import Component from "."
import type { Meta } from "@storybook/svelte"

const meta: Meta<typeof Component> = {
	component: Component as any,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		mockData: []
	}
}

export default meta

const Template = ({ ...args }) => ({
	Component,
	props: args
})

export const Default = Template.bind({})

Default.args = {}
