<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, BasicTextInput, MultiSelect } from "$components"
	import { AdminCreateAdminRole as Form } from "$validation/forms"
	export let disabled = false

	////
	// PARENT EXPORTS
	////

	export let adminPermissions: SelectAdminPermission[]

	////
	// LOCAL EXPORTS
	////

	export let form = new Form()
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
	<BasicTextInput
		label="Name"
		id="name"
		type="name"
		bind:value={data.name}
		bind:fieldValidator={form.fields.name}
		bind:fieldErrors={errors.name}
		{disabled}
	/>

	<MultiSelect
		label="Admin Permissions"
		id="adminPermissions"
		size={10}
		bind:value={data.adminPermissions}
		bind:fieldValidator={form.fields.adminPermissions}
		bind:fieldErrors={errors.adminPermissions}
		options={adminPermissionOptions}
		{disabled}
	/>
</FormBase>
