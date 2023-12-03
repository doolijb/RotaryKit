<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput, CheckboxInput } from "@components"
	import { forms, utils } from "@validation"
	export let disabled = false

	const canEditSuperUsers = true // TODO

	export let formData: { [key: string]: any } = {
		username: "",
		email: "",
		passphrase: "",
		isVerified: false,
		isAdmin: false,
		isSuperUser: false
	}

	export let formErrors: FormErrors = {}
	export let canSubmit: boolean

	/**
	 * TODO: This is a hack to remove the isAdmin and isSuperUser fields if the user is not allowed to edit them
	 */
	const definitions = forms.adminCreateUser
	if (!canEditSuperUsers) {
		delete definitions["isAdmin"]
		delete formData["isAdmin"]
		delete definitions["isSuperUser"]
		delete formData["isSuperUser"]
	}

	export let formValidator: FormValidator = utils.formValidator({
		definitions
	})
</script>

<FormBase bind:formValidator bind:formErrors bind:formData bind:canSubmit on:submit on:cancel>
	<BasicTextInput
		label="Username"
		id="username"
		type="username"
		bind:value={formData.username}
		bind:fieldValidator={formValidator.fields.username}
		bind:fieldErrors={formErrors.username}
		{disabled}
	/>

	<BasicTextInput
		label="Email"
		id="email"
		type="email"
		bind:value={formData.email}
		bind:fieldValidator={formValidator.fields.email}
		bind:fieldErrors={formErrors.email}
		{disabled}
	/>

	<PassphraseInput
		label="Passphrase"
		id="passphrase"
		bind:value={formData.passphrase}
		bind:fieldValidator={formValidator.fields.passphrase}
		bind:fieldErrors={formErrors.passphrase}
		{disabled}
	/>

	<div class="flex space-x-3 my-4">
		<div class="card px-3 py-2">
			<CheckboxInput
				label="Is Verified"
				type="checkbox"
				id="isVerified"
				bind:checked={formData.isVerified}
				bind:fieldValidator={formValidator.fields.isVerified}
				{disabled}
			/>
		</div>

		{#if formValidator.fields.isAdmin}
			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Admin"
					type="checkbox"
					id="isAdmin"
					bind:checked={formData.isAdmin}
					bind:fieldValidator={formValidator.fields.isAdmin}
					{disabled}
				/>
			</div>
		{/if}

		{#if formValidator.fields.isSuperUser}
			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Super User"
					type="checkbox"
					id="isSuperUser"
					bind:checked={formData.isSuperUser}
					bind:fieldValidator={formValidator.fields.isSuperUser}
					{disabled}
				/>
			</div>
		{/if}
	</div>
	<div slot="submit" />
	<div slot="cancel" />
</FormBase>
