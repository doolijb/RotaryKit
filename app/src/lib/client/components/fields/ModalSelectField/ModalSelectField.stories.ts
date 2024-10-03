import Component from "."
import type { Meta } from "@storybook/svelte"
import { FormSchema } from "$shared/validation/base"
import { validators as v } from "$shared/validation"
import type { ComponentType } from "svelte"

const meta: Meta<typeof Component> = {
	component: Component as ComponentType,
	tags: ["autodocs"],
	decorators: []
}

export default meta

class DefaultForm extends FormSchema {
	fields = {
		inputField: v.String.init()
	}
	fieldAttributes = {
		inputField: {
			label: "Input Field"
		}
	}
	optional = { inputField: true }
}

async function getOptions ({searchString: string}) {
	await new Promise((resolve) => setTimeout(resolve, 2000))
	return [
		{ id: 1, title: "Elephant" },
		{ id: 2, title: "Lion" },
		{ id: 3, title: "Tiger" },
		{ id: 4, title: "Giraffe" },
		{ id: 5, title: "Zebra" },
		{ id: 6, title: "Hippo" }
	].filter((option) => option.title.toLowerCase().includes(string.toLowerCase()))
}

function mapOptions (options) {
	return options.map((option) => ({
		value: option.id,
		label: option.title
	}))
}

export const Default = {
	args: {
		getOptions,
		mapOptions,
		field: "inputField",
		form: DefaultForm.init(),
		data: { inputField: "" },
		errors: {},
	}
}

export const Disabled = {
	args: {
		getOptions,
		mapOptions,
		disabled: true,
		field: "inputField",
		form: DefaultForm.init(),
		data: { inputField: 3 },
		errors: {}
	}
}

export const Filled = {
	args: {
		getOptions,
		mapOptions,
		field: "inputField",
		form: DefaultForm.init(),
		data: { inputField: 3 },
		errors: {},
		result: { id: 3, title: "Tiger" },
	}
}

class WithValidatorsForm extends FormSchema {
	fields = {
		inputField: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 10 })
	}
	optional = {}
	fieldAttributes = {
		inputField: {
			label: "Modal Select Field",
			description:
				"You can add additional information about how your users should fill out this field here."
		}
	}
}

export const WithValidators = {
	args: {
		getOptions,
		mapOptions,
		field: "inputField",
		form: WithValidatorsForm.init(),
		data: { inputField: "" },
		errors: {}
	}
}

export const FilledWithValidators = {
	args: {
		getOptions,
		mapOptions,
		field: "inputField",
		form: WithValidatorsForm.init(),
		data: { inputField: 3 },
		errors: {},
		result: { id: 3, title: "Tiger" },
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
			placeholder: "Select an option"
		}
	}
}

export const WithPlaceholder = {
	args: {
		getOptions,
		mapOptions,
		field: "inputField",
		form: WithPlaceholderForm.init(),
		data: { inputField: "" },
		errors: {},
		result: { id: 3, title: "Tiger" },
	}
}
