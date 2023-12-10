<script lang="ts">
	import { FormBase, BasicTextInput, MultiSelect } from "@components"
	import { forms, utils } from "@validation"
	import { onMount } from "svelte"

	export let disabled = false
	export let formData: { [key: string]: any } = {
		adminRoles: []
	}
	export let formErrors: FormErrors = {}
	export let canSubmit: boolean
	export let adminRoles: SelectAdminRole[] = []
	export let result: SelectUser

	export let formValidator: FormValidator = utils.formValidator({
		definitions: forms.adminEditAdminRolesToUser
	})

	let adminRoleOptions = []

	onMount(() => {
		adminRoleOptions = adminRoles.map((role) => ({
			key: role.id,
			label: role.name
		}))
		if (result) {
			Object.values(result.toAdminRoles).forEach(
				({ adminRole }: { adminRole: SelectAdminRole }) => {
					formData.adminRoles.push(adminRole.id)
				}
			)
		}
		if (!formData) {
			formValidator.test(formData).then((result) => {
				formErrors = result
			})
		}
	})
</script>

<FormBase bind:formValidator bind:formErrors bind:formData bind:canSubmit on:submit on:cancel>
	<MultiSelect
		label="Admin Roles"
		id="adminRoles"
		size={10}
		bind:value={formData.adminRoles}
		bind:fieldValidator={formValidator.fields.adminRoles}
		bind:fieldErrors={formErrors.adminRoles}
		options={adminRoleOptions}
		disabled={disabled || !adminRoleOptions.length}
	/>

	<div slot="submit" />
	<div slot="cancel" />
</FormBase>
