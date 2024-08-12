<script lang="ts">
	import { FormBase, TextInput, PassphraseInput } from "$client/components"
	import { NewPassphrase as Form } from "$shared/validation/forms"

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
		passphrase: "",
		passphraseConfirm: "",
	} 
	export let errors: FormErrors = {}

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit on:submit showCancel={false}>
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
