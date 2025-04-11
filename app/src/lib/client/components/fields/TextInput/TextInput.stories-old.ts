import Component from "./TextInput.svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import { FormSchema } from "$shared/validation/base"
import { validators as v } from "$shared/validation"

const meta: Meta<typeof Component> = {
	component: Component,
	// tags: ["autodocs"],
	// decorators: []
}

export default meta
type Story = StoryObj<typeof meta>;

class DefaultForm extends FormSchema {
	fields = {
		inputField: v.String.init()
	}
	optional = { inputField: true }
	fieldAttributes = {
		inputField: {
			label: "Input Field"
		}
	}
}

export const Default: Story = {
	args: {
		field: "inputField",
		form: DefaultForm.init({data: { inputField: "" }}),
	}
}

export const Disabled: Story = {
	args: {
		field: "inputField",
		form: DefaultForm.init({data: { inputField: "Hello world" }}),
	}
}

export const Filled: Story = {
	args: {
		field: "inputField",
		form: DefaultForm.init({data: { inputField: "Hello world" }}),
	}
}

class WithValidatorsForm extends FormSchema {
	fields = {
		inputField: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 10 })
	}
	optional = {}
	fieldAttributes = {
		inputField: {
			label: "Input Field",
			description:
				"You can add additional information about how your users should fill out this field here."
		}
	}
}

export const WithValidators: Story = {
	args: {
		field: "inputField",
		form: WithValidatorsForm.init({data: { inputField: "" }})
	}
}

export const FilledWithValidators: Story = {
	args: {
		field: "inputField",
		form: WithValidatorsForm.init({data: { inputField: "Hello world" }})
	}
}

class WithPlaceholderForm extends FormSchema {
	fields = {
		inputField: new v.String()
	}
	optional = {}
	fieldAttributes = {
		inputField: {
			label: "Input Field",
			placeholder: "Enter your name"
		}
	}
}

export const WithPlaceholder: Story = {
	args: {
		field: "inputField",
		form: WithPlaceholderForm.init({data: { inputField: "" }})
	}
}
