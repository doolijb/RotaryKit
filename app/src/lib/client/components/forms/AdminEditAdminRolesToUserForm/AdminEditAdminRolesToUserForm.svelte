<script lang="ts">
	import { FormBase, MultiSelect } from "$components"
	import { AdminEditAdminRolesToUser as Form } from "$validation/forms"
	import { onMount } from "svelte"

	////
	// PARENT EXPORTS
	////

	export let adminRoles: SelectAdminRole[]
	export let result: SelectUser & {
		toAdminRoles: (
			SelectUsersToAdminRoles & { adminRole: SelectAdminRole }
		)[]
	}

	////
	// LOCAL EXPORTS
	////

	export let form = new Form()
	export let data: Form["Data"] = { adminRoles: [] }
	export let errors: FormErrors = {}

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean
	export let canSubmit: boolean

	////
	// COMPUTED
	////

	let adminRoleOptions = []

	onMount(() => {
		adminRoleOptions = adminRoles.map((role) => ({
			key: role.id,
			label: role.name
		}))
		if (result) {
			Object.values(result.toAdminRoles).forEach(
				({ adminRole }: { adminRole: SelectAdminRole }) => {
					data.adminRoles.push(adminRole.id)
				}
			)
		}
		if (!data) {
			form.validate({data}).then((result) => {
				errors = result
			})
		}
	})

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
	<MultiSelect
		label="Admin Roles"
		id="adminRoles"
		size={10}
		bind:value={data.adminRoles}
		bind:fieldValidator={form.fields.adminRoles}
		bind:fieldErrors={errors.adminRoles}
		options={adminRoleOptions}
		disabled={disabled || !adminRoleOptions.length}
	/>
</FormBase>
