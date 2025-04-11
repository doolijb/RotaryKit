<script lang="ts">
	import { FormBase, TextInput, SelectField } from "$client/components"
	import { AdminEditImage as Form } from "$shared/validation/forms"

	let form = Form.init()

	////
	// PROPS
	////

	interface Props {
		// Props
		result?: SelectImage

		// Bindables
		data: Form["Data"]
		populatedFormData?: boolean

		// Events
		onsubmit?: (e: Event) => Promise<void>
		oncancel?: (e: Event) => Promise<void>
	}

	let {
		// Props
		result,
		populatedFormData = $bindable(false),

		// Events
		onsubmit,
		oncancel
	}: Props = $props();

	////
	// COMPUTED
	////

	$effect.pre(() => {
		if (!populatedFormData && result) {
			formCtx.data.title = result.title
			formCtx.data.status = result.status
			populatedFormData = true
		}
	})

</script>

<FormBase
	{form}
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
>
	<TextInput
		id="title"
		field="title"
		{form}
	/>

	<SelectField
		id="status"
		field="status"
		{form}
	/>
</FormBase>
