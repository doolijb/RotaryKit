<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, CheckboxInput, TextInput } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import { AdminEditUser as Form, AdminEditUserWithPermissions as FormWithPermissions } from "$shared/validation/forms"
	import { onMount } from "svelte"

	////
	// COMPUTED
	////
	
	let isLoaded = $state(false)
	let canEditSuperUsers = $derived($page.data.user.isSuperUser)

	////
	// PARENT EXPORTS
	


	////
	// LOCAL EXPORTS
	
	

	////
	// CHILD EXPORTS
	

	interface Props {
		////
		result: SelectUser;
		////
		form: FormSchema;
		data: typeof form["Data"];
		errors?: FormErrors;
		////
		disabled?: boolean;
		canSubmit?: boolean;
	}

	let {
		result,
		form = $bindable(),
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		disabled = undefined,
		canSubmit = $bindable(undefined)
	}: Props = $props();

	////
	// LIFECYCLE
	////

	onMount(() => {
		if (canEditSuperUsers) {
			form = FormWithPermissions.init()
		} else {
			form = Form.init()
		}
		data = {
			username: "",
			isVerified: false,
			isActive: false,
			isAdmin: canEditSuperUsers ? false : undefined,
			isSuperUser: canEditSuperUsers ? false : undefined,
		}
		data.username = result.username
		data.isVerified = !!result.verifiedAt
		data.isActive = result.isActive
		if (canEditSuperUsers) {
			data["isAdmin"] = result.isAdmin
			data["isSuperUser"] = result.isSuperUser
		}
		isLoaded = true
	})
</script>
{#if isLoaded}
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

		{#if result && $page.data.user.id === result.id}
			<div class="card mb-3">
				<section class="p-4">
					<p class="text-red-500">
						<b>Warning:</b> You are editing your own user.
						This may result in you losing access to your account.
					</p>
				</section>
			</div>
		{/if}

		<TextInput
			label="Username"
			id="username"
			field="username"
			{form}
			bind:errors
			bind:data
			{disabled}
		/>

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				label="Is Verified"
				id="isVerified"
				field="isVerified"
				{form}
				bind:errors
				bind:data
				{disabled}
			/>
		</div>

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				label="Is Active"
				id="isActive"
				field="isActive"
				{form}
				bind:errors
				bind:data
				{disabled}
			/>
		</div>

		{#if canEditSuperUsers}
			<div class="card px-3 pt-2 w-100">
				<CheckboxInput
					label="Is Admin"
					id="isAdmin"
					field="isAdmin"
					{form}
					bind:errors
					bind:data
					{disabled}
				/>
			</div>

			<div class="card px-3 pt-2 w-100">
				<CheckboxInput
					label="Is Super User"
					id="isSuperUser"
					field="isSuperUser"
					{form}
					bind:errors
					bind:data
					{disabled}
				/>
			</div>
		{/if}
	</FormBase>
{/if}
