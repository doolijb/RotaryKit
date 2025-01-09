<script lang="ts">
	import { FormBase, TextInput, SelectField } from "$client/components"
	import { AdminEditVideo as Form } from "$shared/validation/forms"

	const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		// Props
		result?: SelectImage

		// Bindables
		data: Form["Data"]
		errors?: FormErrors
		disabled?: boolean
		canSubmit?: boolean
		populatedFormData?: boolean

		// Events
		onsubmit?: (e: Event) => Promise<void>
		oncancel?: (e: Event) => Promise<void>
	}

	let {
		// Props
		result,

		// Bindables
		data = $bindable({
			title: "",
			status: "",
		}),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),
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
			data.title = result.title
			data.status = result.status
			populatedFormData = true
			form.validate({data}).then((result) => {
				errors = result
			})
		}
	})

</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	bind:disabled 
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
>
	<TextInput
		id="title"
		field="title"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>

	<SelectField
		id="status"
		field="status"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>
</FormBase>
