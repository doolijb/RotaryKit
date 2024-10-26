<script lang="ts">
	import { run } from 'svelte/legacy';
	import { FormBase, TextInput, MultiSelect } from "$client/components"
	import { AdminEditAdminRole as Form } from "$shared/validation/forms"
	
	////
	// PROPS
	////

	interface Props {
		disabled?: boolean;
		result: SelectAdminRole & {
		toAdminPermissions: (
			SelectAdminRolesToPermissions & {
				adminPermission: SelectAdminPermission
			}
		)[]
	};
		adminPermissions: SelectAdminPermission[];
		form?: any;
		data?: Form["Data"];
		errors?: FormErrors;
		canSubmit?: boolean;
		populatedFormData?: boolean;
	}

	let {
		disabled = $bindable(false),		result,
		adminPermissions,
		form = $bindable(Form.init()),
		data = $bindable({
		name: "",
		adminPermissions: []
	}),
		errors = $bindable({}),
		canSubmit = $bindable(undefined),
		populatedFormData = $bindable(undefined)
	}: Props = $props();

	////
	// CALCULATED
	////

	let adminPermissionOptions = $derived(adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	})))

	////
	// LIFE CYCLE
	////

	$effect(() => {
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
	});
</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	{onsubmit}
	{oncancel}
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
