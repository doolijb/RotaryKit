<script lang="ts">
	import { FormBase, FileDropField } from "$client/components"
	import { UserProfileImage as Form } from "$shared/validation/forms"

	const form = Form.init()

	
	////
	// LOCAL EXPORTS
	////
	interface Props {
		// Props
		disabled?: boolean

		// Bindables
		canSubmit?: boolean
		data?: Record<string, any>
		errors?: Record<string, any>

		// Events
		onsubmit?: () => Promise<void>
		oncancel?: () => Promise<void>
	}

	let {
		// Props
		disabled = $bindable(false),

		// Bindables
		canSubmit = $bindable(false),
		data = $bindable({
			image: [],
		}),
		errors = $bindable({}),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props();

</script>

<FormBase {form} bind:data bind:errors bind:canSubmit {onsubmit} {oncancel} showCancel={false}>
	<FileDropField
		id="image"
		field="image"
		{form}
		{disabled}
		bind:errors
		bind:data
	/>
</FormBase>
