<script lang="ts">
	import { FormBase, TextInput, MultiSelect } from "$client/components"
	import { AdminCreateAdminRole as Form } from "$shared/validation/forms"

	const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		disabled?: boolean;
		adminPermissions: SelectAdminPermission[];
		data?: Form["Data"];
		errors?: FormErrors;
		canSubmit: boolean;
	}

	let {
		disabled = $bindable(false),		adminPermissions,
		data = $bindable({ 
		name: "",
		adminPermissions: [] 
	}),
		errors = $bindable({}),
		canSubmit = $bindable()
	}: Props = $props();

	////
	// COMPUTED
	////

	let adminPermissionOptions = $derived(adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	})))

</script>

<FormBase
	{form}
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
