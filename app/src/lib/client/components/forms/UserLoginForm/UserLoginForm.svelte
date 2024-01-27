<script lang="ts">
	import { FormBase, TextInput, PassphraseInput } from "$components"
	import { UserLogin as Form } from "$validation/forms"

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
		username: "",
		passphrase: "",
	} 
	export let errors: FormErrors = {}

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit on:submit showCancel={false}>
	<TextInput
		id="username"
		field="username"
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
</FormBase>
