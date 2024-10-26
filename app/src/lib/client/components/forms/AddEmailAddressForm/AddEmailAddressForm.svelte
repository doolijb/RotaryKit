<script lang="ts">
	import { FormBase, TextInput } from "$client/components"
	import { AddEmailAddress as Form } from "$shared/validation/forms"


	export const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		form?: Form,
		data?: Form["Data"],
		errors?: FormErrors,
		disabled?: boolean,
		canSubmit?: boolean,
		onsubmit?: () => Promise<void>,
	}

	let {
		// Props

		// Bindables
		data = $bindable({
			email: "",
		}),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		onsubmit
	}: Props = $props();
	
</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	bind:disabled
	{onsubmit}
	showCancel={false}
>
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
</FormBase>
