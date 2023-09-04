<script lang="ts">
	import { FormBase, TextInput, MultiSelect } from "$client/components"
	import { AdminEditAdminRole as Form } from "$shared/validation/forms"
	import { onMount } from "svelte"
	
	////
	// PROPS
	////

	interface Props {
		// Props
		result: SelectAdminRole & {
			toAdminPermissions: (
				SelectAdminRolesToPermissions & {
					adminPermission: SelectAdminPermission
				}
			)[]
		}
		adminPermissions: SelectAdminPermission[]

		// Bindables
		disabled?: boolean
		form?: any
		data?: Form["Data"]
		errors?: FormErrors
		canSubmit?: boolean
		populatedFormData?: boolean

		// Events
		onsubmit: (args?: any) => Promise<void>
		oncancel: () => Promise<void>
	}

	let {
		// Props
		result,
		adminPermissions,

		// Bindable
		disabled = $bindable(false),		
		form = $bindable(Form.init()),
		data = $bindable({
			adminPermissions: []
		} as Form["Data"]),
		errors = $bindable({}),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props();

	////
	// STATE
	////

	let isPopulated = $state(false)

	////
	// CALCULATED
	////

	let adminPermissionOptions = $derived(adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	})))

	////
	// LIFECYCLE
	////

	$effect.pre(() => {
		if (!!result && !isPopulated) {
			isPopulated = true
			data.name = result.name
			data.adminPermissions = result.toAdminPermissions.map(
				(toAdminPermission) => toAdminPermission.adminPermission.id
			)
			form.validate({data}).then((result: FormErrors) => {
				errors = result
			})
		}
	})

	$inspect(data)


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
		id="name"
		field="name"
		{form}
		{disabled}
		bind:data
		bind:errors
	/>

	<MultiSelect
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
