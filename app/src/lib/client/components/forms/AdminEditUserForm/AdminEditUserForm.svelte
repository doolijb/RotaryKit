<script lang="ts">
	import { FormBase, BasicTextInput, PassphraseInput, CheckboxInput } from "$components"
	import { AdminEditUser as Form, AdminEditUserWithPermissions as FormWithPermissions } from "$validation/forms"
	import { onMount } from "svelte"

	////
	// PARENT EXPORTS
	////

	export let result: SelectUser
	export let canEditSuperUsers: boolean

	////
	// LOCAL EXPORTS
	////
	
	export const form = canEditSuperUsers ? new FormWithPermissions() : new Form()
	export let data: typeof form["Data"] = {
		username: "",
		isVerified: false,
		isActive: false,
		isAdmin: canEditSuperUsers ? false : undefined,
		isSuperUser: canEditSuperUsers ? false : undefined,
	}
	export let errors: FormErrors = {}

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean
	export let canSubmit: boolean

	////
	// COMPUTED
	////

	onMount(() => {
		data.username = result.username
		data.isVerified = !!result.verifiedAt
		data.isActive = result.isActive
		if (canEditSuperUsers) {
			data["isAdmin"] = result.isAdmin
			data["isSuperUser"] = result.isSuperUser
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
	<div class="flex space-x-3 my-4">
		<div class="card px-3 py-2">
			<CheckboxInput
				label="Is Verified"
				type="checkbox"
				id="isVerified"
				bind:checked={data.isVerified}
				bind:fieldValidator={form.fields.isVerified}
				{disabled}
			/>
		</div>

		<div class="card px-3 py-2">
			<CheckboxInput
				label="Is Active"
				type="checkbox"
				id="isActive"
				bind:checked={data.isActive}
				bind:fieldValidator={form.fields.isActive}
				{disabled}
			/>
		</div>

		{#if canEditSuperUsers}
			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Admin"
					type="checkbox"
					id="isAdmin"
					bind:checked={data["isAdmin"]}
					bind:fieldValidator={form.fields["isAdmin"]}
					{disabled}
				/>
			</div>

			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Super User"
					type="checkbox"
					id="isSuperUser"
					bind:checked={data["isSuperUser"]}
					bind:fieldValidator={form.fields["isSuperUser"]}
					{disabled}
				/>
			</div>
		{/if}
	</div>
</FormBase>
