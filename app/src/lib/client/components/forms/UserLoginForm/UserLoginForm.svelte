<script lang="ts">
	import { FormBase, TextInput, PassphraseInput } from "$client/components"
	import { UserLogin as Form } from "$shared/validation/forms"

	export const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		disabled?: boolean;
		canSubmit?: boolean;
		data?: Form["Data"];
		errors?: FormErrors;
		onsubmit: (args: any) => Promise<void>;
	}

	let {
		disabled = $bindable(false),
		canSubmit = $bindable(false),
		data = $bindable({
			email: "",
			passphrase: "",
		}),
		errors = $bindable({}),
		onsubmit,
	}: Props = $props();

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit {onsubmit} showCancel={false}>
	<TextInput
		id="email"
		field="email"
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
</FormBase>
