import Component from "."
import { validators as v, utils, fields, validators } from "$shared/validation"
import type { Meta } from "@storybook/svelte"
import type { ComponentType } from "svelte"
import { FormSchema } from "$shared/validation/base"

const meta: Meta<typeof Component> = {
	component: Component as ComponentType,
	tags: ["autodocs"],
}

export default meta

const options = [
	{key: 1, label: "Option 1"},
	{key: 2, label: "Option 2"},
	{key: 3, label: "Option 3"},
	{key: 4, label: "Option 4"},
	{key: 5, label: "Option 5"},
	{key: 6, label: "Option 6"},
	{key: 7, label: "Option 7"},
	{key: 8, label: "Option 8"},
	{key: 9, label: "Option 9"},
	{key: 10, label: "Option 10"},
]

class DefaultForm extends FormSchema {
    fields = {
        multiSelectField: v.Array.init(),
    }
    optional = {multiSelectField: true}
    fieldAttributes = {
        multiSelectField: {
            label: "Multi Select Field",
        }
    }
}

export const Default = {
    args: {
        field: "multiSelectField",
        form: DefaultForm.init(),
        data: { multiSelectField: [] },
        errors: {},
		options,
    }
}

// export const Disabled = {
// 	render: Template,
// 	args: {
// 		// Component Props Here
// 		fieldValidator: utils.fieldValidator({definition}),
//         options,
//         disabled: true,
//         value: [1,2]
// 	}
// }

// export const Filled = {
// 	render: Template,
// 	args: {
// 		// Component Props Here
// 		fieldValidator: utils.fieldValidator({definition}),
//         options,
//         value: [1,2]
// 	}
// }
