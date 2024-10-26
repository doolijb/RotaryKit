<script lang="ts">
	import { FormBase, TextInput } from "$client/components"
	import { RecoverPassphraseByEmail as Form } from "$shared/validation/forms"

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
		email: "",
	}),
		errors = $bindable({})
	}: Props = $props();

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
