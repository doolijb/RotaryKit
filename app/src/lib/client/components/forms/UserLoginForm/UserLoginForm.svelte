<script lang="ts">
	import { FormBase, Input, PassphraseInput } from "$client/components"
	import { UserLogin as Form } from "$shared/validation/forms"

	////
	// PROPS
	////

	interface Props {
		onsubmit: (args: any) => Promise<void>
		form?: Form
	}

	let {
		onsubmit,
		form = $bindable(Form.init() as Form),
	}: Props = $props();

</script>

<FormBase {form} {onsubmit} showCancel={false}>
	<Input
		id="email"
		field="email"
		{form}
	/>
	<PassphraseInput
		id="passphrase"
		field="passphrase"
		{form}
	/>
</FormBase>
