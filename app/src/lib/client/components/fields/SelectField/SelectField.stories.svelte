<script module>
	import { defineMeta, type Args } from "@storybook/addon-svelte-csf"
	import SelectField from "."
	import { fn } from "@storybook/test"
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

	const options = [
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
			Form: {
				type: "object"
			}
		},
		args: {
			field: "selectField",
			options
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
			selectField: v.String.init()
		}
		optional = { selectField: true }
		fieldAttributes = {
			selectField: {
				label: "Input Field"
			}
		}
	}

	class DefaultFormMultiple extends FormSchema {
		fields = {
			selectField: v.Array.init()
		}
		optional = { selectField: true }
		fieldAttributes = {
			selectField: {
				label: "Input Field"
			}
		}
	}

	class WithValidatorsForm extends FormSchema {
		fields = {
			selectField: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 12 })
		}
		optional = {}
		fieldAttributes = {
			selectField: {
				label: "Input Field",
			}
		}
	}

	class WithPlaceholderForm extends FormSchema {
		fields = {
			selectField: new v.String()
		}
		optional = {}
		fieldAttributes = {
			selectField: {
				label: "Input Field",
				placeholder: "Enter your name"
			}
		}
	}

	class WithDescriptionForm extends FormSchema {
		fields = {
			selectField: v.String.init()
		}
		optional = {selectField: true}
		fieldAttributes = {
			selectField: {
				label: "Input Field",
				description:
					"You can add additional information about how your users should fill out this field through the form schema."
			}
		}
	}
  </script>
  
{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({data: ctx.parameters.data || {}})}
    <FormBase {form} showCancel={false} showSubmit={false}>
		<SelectField {...args} {form} field={args.field} />
    </FormBase>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="Multi-Select" parameters={{ Form: DefaultFormMultiple }} />

<Story name="Disabled" args={{disabled: true}} parameters={{ Form: DefaultForm, data: { selectField: "purple" } }} />

<Story name="Disabled Multi-Select" args={{disabled: true}} parameters={{ Form: DefaultFormMultiple, data: { selectField: ["purple", "red"] } }} />

<Story name="With Placeholder (Prop)" args={{placeholder: "Placeholder"}} parameters={{ Form: DefaultForm }} />

<Story name="Filled" parameters={{ Form: DefaultForm, data: { selectField: "purple" } }} />

<Story name="Filled Multi-Select" parameters={{ Form: DefaultFormMultiple, data: { selectField: ["purple", "red"] } }} />

<!-- <Story name="With Validators" parameters={{ Form: WithValidatorsForm }} /> -->

<!-- <Story name="With Placeholder (Schema)" parameters={{ Form: WithPlaceholderForm }} /> -->

<!-- <Story name="Filled with Validators" parameters={{ Form: WithValidatorsForm, data: { selectField: "Hello World" } }} /> -->

<!-- <Story name="With Validation Error" parameters={{ Form: WithValidatorsForm, data: { selectField: "H" } }} /> -->

<!-- <Story name="With Description (Prop)" args={{description: "You can add additional information about how your users should fill out this field through props."}} parameters={{ Form: DefaultForm }} /> -->

<!-- <Story name="With Description (Schema)" parameters={{ Form: WithDescriptionForm }} /> -->