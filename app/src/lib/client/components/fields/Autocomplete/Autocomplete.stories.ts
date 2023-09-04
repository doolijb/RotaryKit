import Component from "."
import type { AutocompleteOption } from "@skeletonlabs/skeleton"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"
import { validators as v, utils, fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

const meta: Meta<typeof Component> = {
	component: Component as ComponentType,
	decorators: [],
	tags: ["autodocs"]
}

export default meta

const options: AutocompleteOption[] = [
	{ label: "Option 1", value: "Value 1" },
	{ label: "Option 2", value: "Value 2" },
	{ label: "Option 3", value: "Value 3" }
]

class DefaultForm extends FormSchema {
	fields = {
		autocomplete: v.String.init()
	}
	optional = { autocomplete: true }
	fieldAttributes = {
		autocomplete: {
			label: "Autocomplete"
		}
	}
}

export const Default = {
	args: {
		field: "autocomplete",
		form: DefaultForm.init(),
		data: { autocomplete: "" },
		errors: {},
		options
	}
}

export const Disabled = {
	args: {
		...Default.args,
		data: { autocomplete: "Value 2" },
		disabled: true
	}
}

export const Filled = {
	args: {
		...Default.args,
		data: { autocomplete: "Value 2" }
	}
}

class WithValidatorsForm extends FormSchema {
	fields = {
		autocomplete: v.String.init()
	}
	optional = {}
	fieldAttributes = {
		autocomplete: {
			label: "Autocomplete"
		}
	}
}

export const WithValidators = {
	args: {
		...Default.args,
		form: WithValidatorsForm.init(),
		data: { autocomplete: "" }
	}
}
