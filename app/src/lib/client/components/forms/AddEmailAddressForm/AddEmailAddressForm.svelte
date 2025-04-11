<script lang="ts">
	import { FormBase, TextInput } from "$client/components"
	import { AddEmailAddress as Form } from "$shared/validation/forms"


	let form = $state(Form.init())

	////
	// PROPS
	////

	interface Props {
		form?: Form,
		onsubmit?: () => Promise<void>,
	}

	let {
		// Props

		// Events
		onsubmit
	}: Props = $props();
	
</script>

<FormBase
	{form}
	{onsubmit}
	showCancel={false}
>
	<TextInput
		label="Email"
		id="email"
		type="email"
		field="email"
		{form}
	/>
</FormBase>
