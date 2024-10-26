<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, CheckboxInput, TextInput, ModalSelectField } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import { AdminEditEmail as Form } from "$shared/validation/forms"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton"
	import { onMount } from "svelte"

	////
	// COMPUTED
	////
	let isLoaded = $state(false)
	let canEditSuperUsers = $derived($page.data.user.isSuperUser)
	let canEditUsers = $derived($page.data.permissions?.includes("admin.users.PUT") || canEditSuperUsers)

	////
	// PARENT EXPORTS
	


	////
	// LOCAL EXPORTS
	
	

	////
	// CHILD EXPORTS
	

	interface Props {
		////
		result: SelectEmail & { user: SelectUser | undefined };
		////
		form: FormSchema;
		data: typeof form["Data"];
		errors?: FormErrors;
		getUserOptions: ({searchString}) => Promise<any[]>;
		mapUserOptions: (data: any[]) => AutocompleteOption[];
		////
		disabled?: boolean;
		canSubmit?: boolean;
	}

	let {
		result,
		form = $bindable(),
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		getUserOptions,
		mapUserOptions,
		disabled = undefined,
		canSubmit = $bindable(undefined)
	}: Props = $props();

	////
	// LIFECYCLE
	////

	onMount(() => {
		form = Form.init()
		data = {
			address: "",
			isVerified: false,
			isUserPrimary: false,
		}
		data.address = result.address
		data.isVerified = !!result.verifiedAt
		data.isUserPrimary = result.isUserPrimary
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

		{#if result && $page.data.user.id === result.userId}
			<div class="card mb-3">
				<section class="p-4">
					<p class="text-red-500">
						<b>Warning:</b> You are editing your own email address.
						This may result in you losing access to your account.
					</p>
				</section>
			</div>
		{/if}

		<TextInput
			id="address"
			field="address"
			{form}
			bind:errors
			bind:data
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
				result={result.user}
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
{/if}
