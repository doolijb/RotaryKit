<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput } from "$components"
	import { UserLogin as Form } from "$validation/forms"

	////
	// PARENT EXPORTS
	////

	export let disabled: boolean
	export let canSubmit: boolean

	////
	// LOCAL EXPORTS
	////
	
	export let form = new Form()
	export let data: Form["Data"] = {
		username: "",
		passphrase: "",
	} 
	export let errors: FormErrors

</script>

<FormBase bind:form bind:data bind:errors bind:canSubmit on:submit showCancel={false}>
	<BasicTextInput
		label="Username or Email"
		id="username"
		bind:value={data.username}
		bind:fieldValidator={form.fields.username}
		bind:fieldErrors={errors.username}
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
</FormBase>
