<script lang="ts">
	import { run } from 'svelte/legacy';

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

	////
	// DOWNSTREAM EXPORTS
	

	interface Props {
		data?: typeof form["Data"];
		errors?: FormErrors;
		getUserOptions: ({searchString}) => Promise<any[]>;
		mapUserOptions: (data: any[]) => AutocompleteOption[];
		////
		disabled?: boolean;
		canSubmit?: boolean;
		userChoices?: any;
		userSearchInput?: string;
		getUserChoices?: any;
	}

	let {
		data = $bindable({
		address: "",
		isVerified: false,
		isUserPrimary: false,
		userId: null,
	}),
		errors = $bindable({}),
		getUserOptions,
		mapUserOptions,
		disabled = $bindable(false),
		canSubmit = $bindable(false),
		userChoices = {} as PaginatedResponse<Partial<SelectUser>>,
		userSearchInput = "",
		getUserChoices = (e: any = null) => {}
	}: Props = $props();

	run(() => {
		(userSearchInput: string) => {
			getUserChoices(userSearchInput)
		}
	});
	
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
