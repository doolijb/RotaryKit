<script lang="ts">
	import { FormBase, TextInput, MultiSelect } from "$client/components"
	import { AdminCreateAdminRole as Form } from "$shared/validation/forms"

	let form = $state(Form.init())

	////
	// PROPS
	////

	interface Props {
		adminPermissions: SelectAdminPermission[]

		// Events
		onsubmit: (args?: any) => Promise<void>
		oncancel: () => Promise<void>
	}

	let {
		// Props
		adminPermissions = [],

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
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
	>

	<TextInput
		id="name"
		field="name"
		{form}
	/>

	<MultiSelect
		id="adminPermissions"
		size={10}
		field="adminPermissions"
		{form}
		options={adminPermissionOptions}
	/>
	
</FormBase>
