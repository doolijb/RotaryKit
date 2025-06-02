<script module>
	import { defineMeta, type Args } from "@storybook/addon-svelte-csf"
	import PassphraseInput from "."
	import { fn } from "@storybook/test"
	import { FormSchema } from "$shared/validation/base"
	import { validators as v } from "$shared/validation"
    import { FormBase } from "$client/components"

	const { Story } = defineMeta({
		component: PassphraseInput,
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
			field: "passphraseInput",
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
			passphraseInput: v.String.init()
		}
		optional = { passphraseInput: true }
		fieldAttributes = {
			passphraseInput: {
				label: "Passphrase"
			}
		}
	}

	class WithValidatorsForm extends FormSchema {
		fields = {
			passphraseInput: v.String.init().minLength({minLen: 5}).maxLength({maxLen: 50}).specialCharIncluded().numbersIncluded({count:1})
		}
		optional = {}
		fieldAttributes = {
			passphraseInput: {
				label: "Passphrase",
			}
		}
	}

	class WithDescriptionForm extends FormSchema {
		fields = {
			passphraseInput: v.String.init()
		}
		optional = { passphraseInput: true }
		fieldAttributes = {
			passphraseInput: {
				label: "Passphrase",
				description: "You can add additional information about how your users should fill out this field through the schema."
			}
		}
	}
  </script>
  
{#snippet template(args: Args<typeof Story>, ctx)}
	{@const form = ctx.parameters.Form.init({data: ctx.parameters.data || {}})}
    <FormBase {form} showCancel={false} showSubmit={false}>
		<PassphraseInput {...args} {form} field={args.field} />
    </FormBase>
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" parameters={{ Form: DefaultForm }} />

<Story name="Disabled" args={{disabled: true}} parameters={{ Form: DefaultForm, data: { passphraseInput: "Hello World" } }} />

<Story name="With Placeholder (Prop)" args={{placeholder: "Placeholder"}} parameters={{ Form: DefaultForm }} />

<Story name="Filled" parameters={{ Form: DefaultForm, data: { passphraseInput: "Hello World" } }} />

<Story name="With Validators" parameters={{ Form: WithValidatorsForm }} />

<Story name="Filled with Validators" parameters={{ Form: WithValidatorsForm, data: { passphraseInput: "Hello World!3" } }} />

<Story name="With Validation Error" parameters={{ Form: WithValidatorsForm, data: { passphraseInput: "Hello World" } }} />

<Story name="With Description (Prop)" args={{description: "You can add additional information about how your users should fill out this field through props."}} parameters={{ Form: DefaultForm }} />

<Story name="With Description (Schema)" parameters={{ Form: WithDescriptionForm }} />
