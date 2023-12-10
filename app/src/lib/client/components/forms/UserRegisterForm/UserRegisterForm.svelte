<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput } from "@components"
	import { forms, utils } from "$lib/shared/validation"

	export let disabled = false

	export let formData: { [key: string]: any } = {}

	export let formErrors: FormErrors = {}

	export let formValidator: FormValidator = utils.formValidator({
		definitions: forms.userRegister,
		extras: {
			passphraseConfirm: {
				matches: {
					args: {
						getValue: () => formData.passphrase
					}
				}
			}
		}
	})
	export let canSubmit: boolean = false
</script>

<FormBase
	bind:formValidator
	bind:formErrors
	bind:formData
	bind:canSubmit
	on:submit
	showCancel={false}
>
	<BasicTextInput
		label="Username"
		id="username"
		type="text"
		bind:value={formData.username}
		bind:fieldValidator={formValidator.fields.username}
		bind:fieldErrors={formErrors.username}
		{disabled}
	/>
	<BasicTextInput
		label="Email"
		id="email"
		type="email"
		bind:value={formData.email}
		bind:fieldValidator={formValidator.fields.email}
		bind:fieldErrors={formErrors.email}
		{disabled}
	/>
	<PassphraseInput
		label="Passphrase"
		id="passphrase"
		bind:value={formData.passphrase}
		bind:fieldValidator={formValidator.fields.passphrase}
		bind:fieldErrors={formErrors.passphrase}
		{disabled}
	/>
	<PassphraseInput
		label="Confirm Passphrase"
		id="passphraseConfirm"
		bind:value={formData.passphraseConfirm}
		bind:fieldValidator={formValidator.fields.passphraseConfirm}
		bind:fieldErrors={formErrors.passphraseConfirm}
		{disabled}
	/>
</FormBase>
