<script lang="ts">
	import { FormBase, BasicTextInput, MultiSelect } from "@components"
	import { forms, utils } from "@validation"
	import { onMount } from "svelte"
	export let disabled = false

	export let formData: { [key: string]: any } = {
		name: "",
		adminPermissions: []
	}

	export let formErrors: FormErrors = {}
	export let canSubmit: boolean
	export let adminPermissions: SelectAdminPermission[] = []
	export let result: SelectAdminRole

	export let formValidator: FormValidator = utils.formValidator({
		definitions: forms.adminEditAdminRole
	})

	let populatedFormData = false

	$: adminPermissionOptions = adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	}))

	$: {
		if (!populatedFormData && result) {
			formData.name = result.name
			formData.adminPermissions = result.toAdminPermissions.map(
				(toAdminPermission) => toAdminPermission.adminPermission.id
			)
			populatedFormData = true
			formValidator.test(formData).then((result) => {
				formErrors = result
			})
		}
	}
</script>

<FormBase
	bind:formValidator
	bind:formErrors
	bind:formData
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
		bind:value={formData.name}
		bind:fieldValidator={formValidator.fields.name}
		bind:fieldErrors={formErrors.name}
		disabled={disabled || !populatedFormData}
	/>

	<MultiSelect
		label="Admin Permissions"
		id="adminPermissions"
		size={10}
		bind:value={formData.adminPermissions}
		bind:fieldValidator={formValidator.fields.adminPermissions}
		bind:fieldErrors={formErrors.adminPermissions}
		options={adminPermissionOptions}
		disabled={disabled || !populatedFormData}
	/>
</FormBase>
