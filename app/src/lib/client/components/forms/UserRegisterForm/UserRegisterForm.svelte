<script lang="ts">
	import { FormBase, TextInput, PassphraseInput } from "$client/components"
	import { UserRegister as Form } from "$shared/validation/forms"

	export const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		// Props

		// Bindables
		disabled?: boolean;
		canSubmit?: boolean;
		data?: Form["Data"];
		errors?: FormErrors;

		// Events
		onsubmit: (args: any) => Promise<void>;
		oncancel?: (args: any) => Promise<void>;
	}

	let {
		// Props

		// Bindables
		data = $bindable({
			username: "",
			email: "",
			passphrase: "",
			passphraseConfirm: ""
		}),
		errors = $bindable({} as FormErrors),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel
	}: Props = $props();
	
</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	bind:disabled
	{onsubmit}
	{oncancel}
	showCancel={false}
>
	<TextInput
		id="username"
		field="username"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<TextInput
		id="email"
		type="email"
		field="email"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		id="passphrase"
		field="passphrase"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
	<PassphraseInput
		id="passphraseConfirm"
		field="passphraseConfirm"
		{form}
		bind:data
		bind:errors
		{disabled}
	/>
</FormBase>
