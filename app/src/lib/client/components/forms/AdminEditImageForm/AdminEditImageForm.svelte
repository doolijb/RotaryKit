<script lang="ts">
	import { FormBase, TextInput, FileDropField, SelectField } from "$client/components"
	import { ImageResolutions, ImageSizes, ImageStatus } from "$shared/constants"
	import { AdminEditImage as Form } from "$shared/validation/forms"
	import { onMount } from "svelte"

	////
	// LOCAL EXPORTS
	////

	const form: Form = new Form()
	export let data: typeof form["Data"] = {
		title: "",
		status: ""
	}
	export let errors: FormErrors = {}
	export let result: SelectImage

	////
	// DOWNSTREAM EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	export let populatedFormData: boolean = undefined

	$: {
		if (!populatedFormData && result) {
			data.title = result.title
			data.status = result.status
			populatedFormData = true
			form.validate({data}).then((result) => {
				errors = result
			})
		}
	}

	onMount(() => {
		form.validate({data}).then((result) => {
			errors = result
		})
	})

</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	bind:disabled 
	on:submit
	on:cancel
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
		{form}
		bind:errors
		{disabled}
	/>
</FormBase>
