<script lang="ts">
	import { FormBase, Input } from "$client/components"
	import { RecoverPassphraseByEmail as Form } from "$shared/validation/forms"

	////
	// PROPS
	////
	
	let form = $state(Form.init())
	interface Props {
		// Props

		// Bindings
		disabled?: boolean
		canSubmit?: boolean
		data?: Form["Data"]
		errors?: FormErrors

		// Events
		onsubmit: (args?: any) => Promise<void>
		oncancel?: () => Promise<void>
	}

	let {
		// Props

		// Bindings
		disabled = $bindable(false),
		canSubmit = $bindable(false),
		data = $bindable({
			email: "",
		}),
		errors = $bindable({}),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props();

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit {onsubmit} {oncancel} showCancel={false}>
	<Input
		id="email"
		field="email"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
</FormBase>
