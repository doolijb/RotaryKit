<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, TextInput, CheckboxInput, Autocomplete } from "$client/components"
	import ModalSelectField from "$client/components/fields/ModalSelectField"
	import { AdminCreateEmail as Form } from "$shared/validation/forms"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton"
	
	////
	// CALCULATED
	////

	let canEditUsers = $page.data.permissions?.includes("admin.users.PUT") || $page.data.user.isSuperUser

	////
	// LOCAL EXPORTS
	////

	const form: Form = new Form()
	export let data: typeof form["Data"] = {
		address: "",
		isVerified: false,
		isUserPrimary: false,
		userId: null,
	}
	export let errors: FormErrors = {}
	export let getUserOptions: ({searchString}) => Promise<any[]>
	export let mapUserOptions: (data: any[]) => AutocompleteOption[]

	////
	// DOWNSTREAM EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	export let userChoices = {} as PaginatedResponse<Partial<SelectUser>>
	export let userSearchInput = ""
	export let getUserChoices = (e: any = null) => {}

	$: (userSearchInput: string) => {
		getUserChoices(userSearchInput)
	}
	
</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	bind:disabled
	on:submit
	on:cancel
	showSubmit={false}
	showCancel={false}
>

	<TextInput
		id="address"
		field="address"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>

	{#if canEditUsers}
		<ModalSelectField
			id="userId"
			field="userId"
			bind:data
			bind:errors
			{form}
			{disabled}
			getOptions={getUserOptions}
			mapOptions={mapUserOptions}
		/>
	{/if}

	<div class="flex space-x-3 my-5">
		<div class="card px-3 pt-3 w-full">
			<CheckboxInput
				id="isVerified"
				field="isVerified"
				bind:data
				bind:errors
				{form}
				{disabled}
			/>
		</div>
	</div>

	{#if canEditUsers}
		<div class="flex space-x-3 my-5">
			<div class="card px-3 pt-3 w-full">
				<CheckboxInput
					id="isUserPrimary"
					field="isUserPrimary"				
					bind:data
					bind:errors
					{form}
					{disabled}
				/>
			</div>
		</div>
	{/if}
</FormBase>
