<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf"
	import InputField from "."
	import { fn } from "@storybook/test"
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"
    import { type Args, setTemplate } from "@storybook/addon-svelte-csf";

	const { Story } = defineMeta({
		component: InputField,
		tags: ["autodocs"],
		argTypes: {
			// @ts-ignore 
			Form: {
				type: "object"
			},
			form: {
				control: {
					type: "object",
					disable: true
				}
			}
		},
		args: {
			field: "inputField",
		},
		parameters: {
			controls: {
				exclude: ["Form"]
			},
			Form: {
				type: "object",
			}
		}
	})
</script>

<script lang="ts">
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

	class WithValidatorsForm extends FormSchema {
		fields = {
			inputField: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 12 })
		}
		optional = {}
		fieldAttributes = {
			inputField: {
				label: "Input Field",
			}
		}
	}

	class WithNumberValidatorsForm extends FormSchema {
		fields = {
			inputField: v.Number.init()
		}
		optional = {}
		fieldAttributes = {
			inputField: {
				label: "Input Field",
			}
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

	class WithDescriptionForm extends FormSchema {
		fields = {
			inputField: v.String.init()
		}
		optional = {inputField: true}
		fieldAttributes = {
			inputField: {
				label: "Input Field",
				description:
					"You can add additional information about how your users should fill out this field through the form schema."
			}
		}
	}

	setTemplate(template)
  </script>
  
{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({data: ctx.parameters.data || {}})}
    <FormBase {form} showCancel={false} showSubmit={false}>
		<InputField {...args} {form} field={args.field} />
    </FormBase>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="Number" args={{type:"number"}} parameters={{ Form: DefaultForm }} />

<Story name="Disabled" args={{disabled: true}} parameters={{ Form: DefaultForm, data: { inputField: "Hello World" } }} />

<Story name="With Placeholder (Prop)" args={{placeholder: "Placeholder"}} parameters={{ Form: DefaultForm }} />

<Story name="Filled" parameters={{ Form: DefaultForm, data: { inputField: "Hello World" } }} />

<Story name="Filled Number" args={{type:"number"}} parameters={{ Form: DefaultForm, data: { inputField: 5 } }} />

<Story name="With Validators" parameters={{ Form: WithValidatorsForm }} />

<Story name="Number With Validators" args={{type:"number"}} parameters={{ Form: WithNumberValidatorsForm }} />

<Story name="With Placeholder (Schema)" parameters={{ Form: WithPlaceholderForm }} />

<Story name="Filled with Validators" parameters={{ Form: WithValidatorsForm, data: { inputField: "Hello World" } }} />

<Story name="With Validation Error" parameters={{ Form: WithValidatorsForm, data: { inputField: "H" } }} />

<Story name="With Description (Prop)" args={{description: "You can add additional information about how your users should fill out this field through props."}} parameters={{ Form: DefaultForm }} />

<Story name="With Description (Schema)" parameters={{ Form: WithDescriptionForm }} />
