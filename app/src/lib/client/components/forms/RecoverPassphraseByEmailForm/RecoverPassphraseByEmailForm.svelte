<script lang="ts">
	import { FormBase, TextInput } from "$client/components"
	import { RecoverPassphraseByEmail as Form } from "$shared/validation/forms"

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
		email: "",
	} 
	export let errors: FormErrors = {}

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit on:submit showCancel={false}>
	<TextInput
		id="email"
		field="email"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
</FormBase>
