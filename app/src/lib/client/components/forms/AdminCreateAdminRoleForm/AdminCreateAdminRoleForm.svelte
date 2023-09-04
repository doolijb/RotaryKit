<script lang="ts">
	import { FormBase, TextInput, MultiSelect } from "$client/components"
	import { AdminCreateAdminRole as Form } from "$shared/validation/forms"

	const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		// Props

		// Bindings
		disabled?: boolean
		adminPermissions: SelectAdminPermission[]
		data?: Form["Data"]
		errors?: FormErrors
		canSubmit: boolean

		// Events
		onsubmit: (args?: any) => Promise<void>
		oncancel: () => Promise<void>
	}

	let {
		// Props

		// Bindings
		disabled = $bindable(false),		adminPermissions,
		data = $bindable({ 
			name: "",
			adminPermissions: [] 
		}),
		errors = $bindable({}),
		canSubmit = $bindable(),

		// Events
		onsubmit,
		oncancel
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
