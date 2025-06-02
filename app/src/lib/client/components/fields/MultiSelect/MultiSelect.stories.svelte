<script module>
	import { defineMeta, type Args } from "@storybook/addon-svelte-csf"
	import SelectField from "."
	import { fn } from "@storybook/test"
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

	const numberOptions = [
		{ value: 1, label: "Option 1" },
		{ value: 2, label: "Option 2" },
		{ value: 3, label: "Option 3" },
		{ value: 4, label: "Option 4" },
		{ value: 5, label: "Option 5" },
		{ value: 6, label: "Option 6" },
		{ value: 7, label: "Option 7" },
		{ value: 8, label: "Option 8" },
		{ value: 9, label: "Option 9" },
		{ value: 10, label: "Option 10" }
	]

const stringOptions = [
		{ label: "Green", value: "green" },
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
		{ label: "Yellow", value: "yellow" },
		{ label: "Purple", value: "purple" },
		{ label: "Orange", value: "orange" },
		{ label: "Pink", value: "pink" },
		{ label: "Brown", value: "brown" },
		{ label: "Black", value: "black" },
		{ label: "White", value: "white" }
	]


	const { Story } = defineMeta({
		component: SelectField,
		tags: ["autodocs"],
		argTypes: {
			// @ts-ignore
			Form: {
				type: "object"
			}
		},
		args: {
			field: "multiSelect",
		},
		parameters: {
			controls: {
				exclude: ["Form"]
			},
			Form: {
				type: "object",
			}
		},
		// @ts-ignore - See https://github.com/storybookjs/addon-svelte-csf/pull/295
		render: template
	})
</script>

<script lang="ts">

	class DefaultForm extends FormSchema {
		fields = {
			multiSelect: v.Array.init()
		}
		optional = { multiSelect: true }
		fieldAttributes = {
			multiSelect: {
				label: "Input Field"
			}
		}
	}

	class WithValidatorsForm extends FormSchema {
		fields = {
			multiSelect: v.Array.init().minLength({ minLen: 3 }).maxLength({ maxLen: 12 })
		}
		optional = {}
		fieldAttributes = {
			multiSelect: {
				label: "Input Field",
			}
		}
	}
  </script>
  
{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({data: ctx.parameters.data || {}})}
    <FormBase {form} showCancel={false} showSubmit={false}>
		<SelectField {...args} {form} field={args.field} options={args.options} />
    </FormBase>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default (Number Values)" args={{options: numberOptions}} parameters={{ Form: DefaultForm }} />

<Story name="Default (String Values)" args={{options: stringOptions}} parameters={{ Form: DefaultForm }} />

<Story name ="Disabled" args={{options: numberOptions, disabled: true }} parameters={{ Form: DefaultForm, data: { multiSelect: [1,3,5] } }} />

<Story name ="Filled" args={{options: numberOptions }} parameters={{ Form: DefaultForm, data: { multiSelect: [1,3,5] } }} />