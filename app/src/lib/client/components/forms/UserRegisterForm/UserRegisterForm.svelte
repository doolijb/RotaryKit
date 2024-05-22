<script lang="ts">
	import { FormBase, TextInput, PassphraseInput } from "$client/components"
	import { UserRegister as Form } from "$shared/validation/forms"

	////
	// LOCAL EXPORTS
	////

	export let data: Form["Data"] = {
		username: "",
		email: "",
		passphrase: "",
		passphraseConfirm: ""
	}
	export let errors = {} as FormErrors
	export const form = Form.init()

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	
</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	bind:disabled
	on:submit
	showCancel={false}
>
	<TextInput
		label="Username"
		id="username"
		field="username"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<TextInput
		label="Email"
		id="email"
		type="email"
		field="email"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		label="Passphrase"
		id="passphrase"
		field="passphrase"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		label="Confirm Passphrase"
		id="passphraseConfirm"
		field="passphraseConfirm"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
</FormBase>
