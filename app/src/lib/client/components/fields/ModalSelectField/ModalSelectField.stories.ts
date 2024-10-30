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
		modalSelectField: v.String.init()
	}
	fieldAttributes = {
		modalSelectField: {
			label: "Modal Select Field"
		}
	}
	optional = { modalSelectField: true }
}

async function getOptions({ searchString: string }) {
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

function mapOptions(options) {
	return options.map((option) => ({
		value: option.id,
		label: option.title
	}))
}

export const Default = {
	args: {
		getOptions,
		mapOptions,
		field: "modalSelectField",
		form: DefaultForm.init(),
		data: { modalSelectField: "" },
		errors: {}
	}
}

export const Disabled = {
	args: {
		getOptions,
		mapOptions,
		disabled: true,
		field: "modalSelectField",
		form: DefaultForm.init(),
		data: { modalSelectField: 3 },
		errors: {}
	}
}

export const Filled = {
	args: {
		getOptions,
		mapOptions,
		field: "modalSelectField",
		form: DefaultForm.init(),
		data: { modalSelectField: 3 },
		errors: {},
		result: { id: 3, title: "Tiger" }
	}
}

class WithValidatorsForm extends FormSchema {
	fields = {
		modalSelectField: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 10 })
	}
	optional = {}
	fieldAttributes = {
		modalSelectField: {
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
		field: "modalSelectField",
		form: WithValidatorsForm.init(),
		data: { modalSelectField: "" },
		errors: {}
	}
}

export const FilledWithValidators = {
	args: {
		getOptions,
		mapOptions,
		field: "modalSelectField",
		form: WithValidatorsForm.init(),
		data: { modalSelectField: 3 },
		errors: {},
		result: { id: 3, title: "Tiger" }
	}
}

class WithPlaceholderForm extends FormSchema {
	fields = {
		modalSelectField: new v.String()
	}
	optional = {}
	fieldAttributes = {
		modalSelectField: {
			label: "Modal Select Field",
			placeholder: "Select an option"
		}
	}
}

export const WithPlaceholder = {
	args: {
		getOptions,
		mapOptions,
		field: "modalSelectField",
		form: WithPlaceholderForm.init(),
		data: { modalSelectField: "" },
		errors: {},
		result: { id: 3, title: "Tiger" }
	}
}
