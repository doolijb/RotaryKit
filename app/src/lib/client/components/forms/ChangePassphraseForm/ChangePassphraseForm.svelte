<!--
  ChangePassphraseForm.svelte

  This component provides a form for users to change their passphrase.
  It includes fields for the current passphrase, new passphrase, and confirm new passphrase.
  The form uses the ChangePassphrase validation schema to validate the input fields.
-->

<script lang="ts">
	import { FormBase, PassphraseInput } from "$client/components"
	import { ChangePassphrase as Form } from "$shared/validation/forms"

	////
	// PARENT EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	
	////
	// LOCAL EXPORTS
	////
	
	export const form = Form.init()
	export let data: Form["Data"] = {
		currentPassphrase: "",
		passphrase: "",
		passphraseConfirm: "",
	} 
	export let errors: FormErrors = {}

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit on:submit showCancel={false}>
	<PassphraseInput
		id="currentPassphrase"
		field="currentPassphrase"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		id="passphrase"
		field="passphrase"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		id="passphraseConfirm"
		field="passphraseConfirm"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
</FormBase>
