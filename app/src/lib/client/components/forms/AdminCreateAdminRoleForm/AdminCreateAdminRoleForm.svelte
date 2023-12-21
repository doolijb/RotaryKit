<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, BasicTextInput, MultiSelect } from "@components"
	import { forms, utils } from "@validation"
	export let disabled = false

	////
	// EXPORTS
	////

	export let formData: { [key: string]: any } = {
		name: "",
		adminPermissions: []
	}
	export let formErrors: FormErrors = {}
	export let canSubmit: boolean
	export let adminPermissions: SelectAdminPermission[] = []

	////
	// FORM DEFINITIONS
	////

	const definitions = forms.adminCreateAdminRole

	/**
	 * Remove the isAdmin and isSuperUser fields if the user is not allowed to edit them
	*/
	const canEditSuperUsers = !!$page.data.user.isSuperUser
	if (!canEditSuperUsers) {
		delete definitions["isAdmin"]
		delete formData["isAdmin"]
		delete definitions["isSuperUser"]
		delete formData["isSuperUser"]
	}

	export let formValidator: FormValidator = utils.formValidator({
		definitions
	})

	////
	// COMPUTED
	////

	$: adminPermissionOptions = adminPermissions.map((permission) => ({
		key: permission.id,
		label: permission.name
	}))
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
		{disabled}
	/>

	<MultiSelect
		label="Admin Permissions"
		id="adminPermissions"
		size={10}
		bind:value={formData.adminPermissions}
		bind:fieldValidator={formValidator.fields.adminPermissions}
		bind:fieldErrors={formErrors.adminPermissions}
		options={adminPermissionOptions}
		{disabled}
	/>
</FormBase>
