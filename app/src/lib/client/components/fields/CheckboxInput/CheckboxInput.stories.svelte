<script module>
	import { defineMeta, type Args } from "@storybook/addon-svelte-csf"
	import CheckboxInput from "."
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
	import { FormBase } from "$client/components"

	const { Story } = defineMeta({
		component: CheckboxInput,
		tags: ["autodocs"],
		argTypes: {},
		args: {
			field: "checkboxInput"
		},
		parameters: {
			controls: {
				exclude: ["Form"]
			},
			Form: {
				type: "object"
			}
		},
		render: template
	})
</script>

<script lang="ts">
	class DefaultForm extends FormSchema {
		fields = {
			checkboxInput: v.Boolean.init()
		}
		fieldAttributes = {
			checkboxInput: {
				label: "Checkbox Input"
			}
		}
		optional = { checkboxInput: true }
	}

	class WithDescriptionForm extends FormSchema {
		fields = {
			checkboxInput: v.Boolean.init()
		}
		fieldAttributes = {
			checkboxInput: {
				label: "Checkbox Input",
				description: "This is a description for the checkbox input."
			}
		}
		optional = { checkboxInput: true }
	}
</script>

{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({ data: ctx.parameters.data || {} })}
	<FormBase {form} showCancel={false} showSubmit={false}>
		<CheckboxInput {...args} {form} field={args.field} />
	</FormBase>
{/snippet}

<Story name="Default" parameters={{ Form: DefaultForm }} />
<Story name="Checked" parameters={{ Form: DefaultForm, data: { checkboxInput: true } }} />
<Story name="With Description" parameters={{ Form: WithDescriptionForm }} />
