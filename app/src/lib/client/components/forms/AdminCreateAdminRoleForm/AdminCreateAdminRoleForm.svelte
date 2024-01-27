<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, TextInput, MultiSelect } from "$components"
	import { AdminCreateAdminRole as Form } from "$validation/forms"
	export let disabled = false

	////
	// PARENT EXPORTS
	////

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

	export let canSubmit: boolean

	////
	// COMPUTED
	////

	$: adminPermissionOptions = adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	}))

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
		{disabled}
		bind:data
		bind:errors
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
		{disabled}
	/>
</FormBase>
