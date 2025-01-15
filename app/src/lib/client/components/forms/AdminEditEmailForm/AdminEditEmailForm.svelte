<script lang="ts">
	import { page } from "$app/state"
	import { FormBase, CheckboxInput, TextInput, ModalSelectField } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import { AdminEditEmail as Form } from "$shared/validation/forms"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton-svelte"
	import { onMount } from "svelte"

	const form = Form.init()

	////
	// PROPS
	////

	interface Props {
		// Props
		result: SelectEmail & { user?: SelectUser };

		// Bindings
		disabled?: boolean
		canSubmit?: boolean
		form: FormSchema
		data: Form["Data"]
		errors?: FormErrors

		// Events
		getUserOptions: ({searchString}) => Promise<any[]>
		mapUserOptions: (data: any[]) => AutocompleteOption[]
		onsubmit: (args: any) => Promise<void>
		oncancel: () => Promise<void>
	}

	let {
		// Props
		result,

		// Bindings
		data = $bindable({} as Form["Data"]),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		getUserOptions,
		mapUserOptions,
		onsubmit,
		oncancel,
	}: Props = $props();

	/////
	// STATE
	////

	let isLoaded = $state(false)

	////
	// COMPUTED
	////
	
	let canEditSuperUsers = $derived(page.data.user.isSuperUser)
	let canEditUsers = $derived(page.data.permissions?.includes("admin.users.PUT") || canEditSuperUsers)

	////
	// LIFECYCLE
	////

	onMount(() => {

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
		{onsubmit}
		{oncancel}
		showSubmit={false}
		showCancel={false}
	>

		{#if result && page.data.user.id === result.userId}
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
