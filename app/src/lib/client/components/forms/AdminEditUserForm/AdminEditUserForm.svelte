<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput, CheckboxInput } from "@components"
	import { forms, utils } from "@validation"
	import { onMount } from "svelte"
	import { format } from "date-fns"
	import moment from "moment"
	
	export let disabled = false
	export let result: SelectUser

	const canEditSuperUsers = true // TODO

	export let formData: { [key: string]: any } = {
		verifiedAt: null,
		isAdmin: false,
		isSuperUser: false
	}

	export let formErrors: FormErrors = {}
	export let canSubmit: boolean

	/**
	 * TODO: This is a hack to remove the isAdmin and isSuperUser fields if the user is not allowed to edit them
	 */
	const definitions = forms.adminEditUser
	if (!canEditSuperUsers) {
		delete definitions["isAdmin"]
		delete formData["isAdmin"]
		delete definitions["isSuperUser"]
		delete formData["isSuperUser"]
	}

	export let formValidator: FormValidator = utils.formValidator({
		definitions
	})

	onMount(() => {
		try {
			// TODO - FIX: result == undefined on remount
			// Should be inconsequential, but still...
			formData.verifiedAt !== !!result.verifiedAt ? (formData.verifiedAt = moment(result.verifiedAt).format("YYYY-MM-DD HH:mm:ss.SSS")) : ""
			formData.isActive !== result.isActive && (formData.isActive = result.isActive)
			if (canEditSuperUsers) {
				formData.isAdmin !== result.isAdmin && (formData.isAdmin = result.isAdmin)
				formData.isSuperUser !== result.isSuperUser && (formData.isSuperUser = result.isSuperUser)
			}
		} catch (error) {
			// console.log(error)
		}
	})
</script>

<FormBase bind:formValidator bind:formErrors bind:formData bind:canSubmit on:submit on:cancel>
	<div class="flex">
		<div class="flex-1">
			<BasicTextInput
				label="Verified At"
				id="verifiedAt"
				type="datetime-local"
				bind:value={formData.verifiedAt}
				bind:fieldValidator={formValidator.fields.verifiedAt}
				{disabled}
			>
				<button
					slot="suffix"
					type="button"
					class="btn btn-sm variant-filled-surface inline-block align-bottom inline"
					on:click={() => (formData.verifiedAt = null)}
					disabled={disabled || !formData.verifiedAt}
				>
					Clear
				</button>
			</BasicTextInput>
		</div>
	</div>

	<div class="flex space-x-3 my-4">
		<div class="card px-3 py-2">
			<CheckboxInput
				label="Is Active"
				type="checkbox"
				id="isActive"
				bind:checked={formData.isActive}
				bind:fieldValidator={formValidator.fields.isActive}
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
