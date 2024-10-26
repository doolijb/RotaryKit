<!--
	
-->

<script lang="ts">
	import { FormBase, PassphraseInput } from "$client/components"
	import { NewPassphrase as Form } from "$shared/validation/forms"

	////
	// PARENT EXPORTS
	

	
	////
	// LOCAL EXPORTS
	////
	
	export const form = Form.init()
	interface Props {
		////
		disabled?: boolean;
		canSubmit?: boolean;
		data?: Form["Data"];
		errors?: FormErrors;
	}

	let {
		disabled = undefined,
		canSubmit = $bindable(undefined),
		data = $bindable({
		passphrase: "",
		passphraseConfirm: "",
	}),
		errors = $bindable({})
	}: Props = $props();

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
