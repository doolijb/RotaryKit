<script module>
	import { defineMeta, type Args } from "@storybook/addon-svelte-csf"
	import RichTextField from "."
	import { fn } from "@storybook/test"
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

	const { Story } = defineMeta({
		component: RichTextField,
		tags: ["autodocs"],
		argTypes: {
			// @ts-ignore
			Form: {
				type: "object"
			},
			field: {
				control: false,
			},
			ref: {
				control: false,
			},
			form: {
				control: false,
			},
		},
		args: {
			field: "richText",
		},
		parameters: {
			controls: {
				exclude: ["Form"],
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
			richText: v.String.init()
		}
		optional = { richText: true }
		fieldAttributes = {
			richText: {
				label: "Rich Text"
			}
		}
	}

	class WithValidatorsForm extends FormSchema {
		fields = {
			richText: v.String.init().minLength({ minLen: 3 }).maxLength({ maxLen: 12 })
		}
		optional = {}
		fieldAttributes = {
			richText: {
				label: "Rich Text",
			}
		}
	}

	class WithPlaceholderForm extends FormSchema {
		fields = {
			richText: new v.String()
		}
		optional = {}
		fieldAttributes = {
			richText: {
				label: "Rich Text",
				placeholder: "Write a story..."
			}
		}
	}

	class WithDescriptionForm extends FormSchema {
		fields = {
			richText: v.String.init()
		}
		optional = {richText: true}
		fieldAttributes = {
			richText: {
				label: "Rich Text",
				description:
					"You can add additional information about how your users should fill out this field through the form schema."
			}
		}
	}
  </script>
  
{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({data: ctx.parameters.data || {}})}
    <FormBase {form} showCancel={false} showSubmit={false}>
		<RichTextField {...args} {form} field={args.field} />
    </FormBase>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="Disabled" args={{disabled: true}} parameters={{ Form: DefaultForm, data: { richText: "Hello World" } }} />

<Story name="With Placeholder (Prop)" args={{placeholder: "Placeholder"}} parameters={{ Form: DefaultForm }} />

<Story name="Filled" parameters={{ Form: DefaultForm, data: { richText: "Hello World" } }} />

<Story name="With Validators" parameters={{ Form: WithValidatorsForm }} />

<Story name="With Placeholder (Schema)" parameters={{ Form: WithPlaceholderForm }} />

<Story name="Filled with Validators" parameters={{ Form: WithValidatorsForm, data: { richText: "Hello World" } }} />

<Story name="With Validation Error" parameters={{ Form: WithValidatorsForm, data: { richText: "H" } }} />

<Story name="With Description (Prop)" args={{description: "You can add additional information about how your users should fill out this field through props."}} parameters={{ Form: DefaultForm }} />

<Story name="With Description (Schema)" parameters={{ Form: WithDescriptionForm }} />
