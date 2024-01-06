<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput } from "$components"
	import { UserRegister as Form } from "$validation/forms"

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
	export let form = new Form()

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean
	export let canSubmit: boolean
	
</script>

<FormBase
	bind:form
	bind:errors
	bind:data
	bind:canSubmit
	on:submit
	showCancel={false}
>
	<BasicTextInput
		label="Username"
		id="username"
		type="text"
		bind:value={data.username}
		bind:fieldValidator={form.fields.username}
		bind:fieldErrors={errors.username}
		{disabled}
	/>
	<BasicTextInput
		label="Email"
		id="email"
		type="email"
		bind:value={data.email}
		bind:fieldValidator={form.fields.email}
		bind:fieldErrors={errors.email}
		{disabled}
	/>
	<PassphraseInput
		label="Passphrase"
		id="passphrase"
		bind:value={data.passphrase}
		bind:fieldValidator={form.fields.passphrase}
		bind:fieldErrors={errors.passphrase}
		{disabled}
	/>
	<PassphraseInput
		label="Confirm Passphrase"
		id="passphraseConfirm"
		bind:value={data.passphraseConfirm}
		bind:fieldValidator={form.fields.passphraseConfirm}
		bind:fieldErrors={errors.passphraseConfirm}
		{disabled}
	/>
</FormBase>
