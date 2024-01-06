import Component from "."
import { validators as v, utils, fields, validators } from "$validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"

const meta: Meta<typeof Component> = {
	component: Component as ComponentType,
	tags: ["autodocs"],
	decorators: [],
	argTypes: {
		label: {
			type: {
				name: "string",
				required: false
			}
		},
		type: {
			type: {
				name: "string",
				required: false
			},
			control: {
				type: "select",
				options: ["text", "password", "email", "number"]
			}
		},
		fieldValidator: {
			type: {
				name: "object",
				required: true
			}
		},
		value: {
			type: {
				name: "string",
				required: false
			}
		},
		placeholder: {
			type: {
				name: "string",
				required: false
			}
		},
		disabled: {
			type: {
				name: "boolean",
				required: false
			}
		},
		fieldErrors: {
			type: {
				name: "object",
				required: false
			}
		},
		isTouched: {
			type: {
				name: "boolean",
				required: false
			}
		},
		onInput: {
			action: "onInput",
			table: {
				disable: true
			}
		},
		onFocus: {
			action: "onFocus",
			table: {
				disable: true
			}
		},
		onBlur: {
			action: "onBlur",
			table: {
				disable: true
			}
		}
	} as any
}

export default meta

const Template = (args: { value: boolean }) => ({
	Component,
	props: args
})

const options = {
	1: "Option 1",
	2: "Option 2",
	3: "Option 3",
	4: "Option 4",
	5: "Option 5",
	6: "Option 6"
}

const definition = {
    multiSelectOptions: {
        validator: validators.multiSelectOptions,
        args: {
            options: Object.keys(options)
        }
    }
}

export const Default = {
	render: Template,
	args: {
		// Component Props Here
		fieldValidator: utils.fieldValidator({definition}),
        options
	}
}

export const Disabled = {
	render: Template,
	args: {
		// Component Props Here
		fieldValidator: utils.fieldValidator({definition}),
        options,
        disabled: true,
        value: [1,2]
	}
}

export const Filled = {
	render: Template,
	args: {
		// Component Props Here
		fieldValidator: utils.fieldValidator({definition}),
        options,
        value: [1,2]
	}
}
