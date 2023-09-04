<!--
  ChangePassphraseForm.svelte

  This component provides a form for users to change their passphrase.
  It includes fields for the current passphrase, new passphrase, and confirm new passphrase.
  The form uses the ChangePassphrase validation schema to validate the input fields.
-->

<script lang="ts">
	import { FormBase, PassphraseInput } from "$client/components"
	import { ChangePassphrase as Form } from "$shared/validation/forms"

	export const form = Form.init()
	
	////
	// LOCAL EXPORTS
	////
	
	interface Props {
		// Props

		// Bindables
		disabled?: boolean
		canSubmit?: boolean
		data?: Form["Data"]
		errors?: FormErrors

		// Events
		onsubmit?: () => Promise<void>
	}

	let {
		// Props

		// Bindables
		disabled = $bindable(false),
		canSubmit = $bindable(false),
		data = $bindable({
			currentPassphrase: "",
			passphrase: "",
			passphraseConfirm: "",
		}),
		errors = $bindable({}),

		// Events
		onsubmit

	}: Props = $props();

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit {onsubmit} showCancel={false}>
	<PassphraseInput
		id="currentPassphrase"
		field="currentPassphrase"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>
	<PassphraseInput
		id="passphrase"
		field="passphrase"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>
	<PassphraseInput
		id="passphraseConfirm"
		field="passphraseConfirm"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>
</FormBase>
