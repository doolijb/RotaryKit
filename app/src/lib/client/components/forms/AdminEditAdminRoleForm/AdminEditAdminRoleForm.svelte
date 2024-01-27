<script lang="ts">
	import { FormBase, TextInput, MultiSelect } from "$components"
	import { AdminEditAdminRole as Form } from "$validation/forms"
	import { onMount } from "svelte"
	export let disabled = false

	////
	// PARENT EXPORTS
	////

	export let result: SelectAdminRole & {
		toAdminPermissions: (
			SelectAdminRolesToPermissions & {
				adminPermission: SelectAdminPermission
			}
		)[]
	}
	export let adminPermissions: SelectAdminPermission[]
	
	////
	// LOCAL EXPORTS
	////

	export let form = Form.init()
	export let data: Form["Data"] = {
		name: "",
		adminPermissions: []
	}
	export let errors: FormErrors = {}
	
	////
	// CHILD EXPORTS
	////

	export let canSubmit: boolean = undefined
	export let populatedFormData: boolean = undefined

	////
	// COMPUTED
	////

	$: adminPermissionOptions = adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	}))

	$: {
		if (!populatedFormData && result) {
			data.name = result.name
			data.adminPermissions = result.toAdminPermissions.map(
				(toAdminPermission) => toAdminPermission.adminPermission.id
			)
			populatedFormData = true
			form.validate({data}).then((result) => {
				errors = result
			})
		}
	}
</script>

<FormBase
	bind:form
	bind:errors
	bind:data
	bind:canSubmit
	on:submit
	on:cancel
	showSubmit={false}
	showCancel={false}
>
	<TextInput
		label="Name"
		id="name"
		field="name"
		{form}
		bind:data
		bind:errors
		disabled={disabled || !populatedFormData}
	/>

	<MultiSelect
		label="Admin Permissions"
		id="adminPermissions"
		size={10}
		field="adminPermissions"
		{form}
		bind:data
		bind:errors
		options={adminPermissionOptions}
		disabled={disabled || !populatedFormData}
	/>
</FormBase>
