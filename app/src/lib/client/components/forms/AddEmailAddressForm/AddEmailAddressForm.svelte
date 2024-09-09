<script lang="ts">
	import { FormBase, TextInput } from "$client/components"
	import { AddEmailAddress as Form } from "$shared/validation/forms"

	////
	// LOCAL EXPORTS
	////

	export let data: Form["Data"] = {
		email: "",
	}
	export let errors = {} as FormErrors
	export const form = Form.init()

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	
</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	bind:disabled
	on:submit
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
