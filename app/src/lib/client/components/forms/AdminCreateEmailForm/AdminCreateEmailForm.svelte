<script lang="ts">
	import { page } from "$app/state"
	import { FormBase, TextInput, CheckboxInput } from "$client/components"
	import ModalSelectField from "$client/components/fields/ModalSelectField"
	import { AdminCreateEmail as Form } from "$shared/validation/forms"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton-svelte"

	const form = Form.init()

	////
	// Props
	////

	interface Props {
		// Props

		// Bindables
		data?: typeof form["Data"];
		errors?: FormErrors;
		disabled?: boolean;
		canSubmit?: boolean;
		userSearchInput?: string;
		getUserChoices?: any;

		// Events
		onsubmit: (args?: any) => Promise<void>;
		oncancel: () => Promise<void>;
		getUserOptions: ({searchString}) => Promise<any[]>;
		mapUserOptions: (data: any[]) => AutocompleteOption[];
	}

	let {
		// Props

		// Bindables
		data = $bindable({
			address: "",
			isVerified: false,
			isUserPrimary: false,
			userId: null,
		}),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),
		userSearchInput = $bindable(""),

		// Events
		onsubmit,
		oncancel,
		getUserOptions,
		mapUserOptions,
	}: Props = $props();

	////
	// STATE
	////

	let ready = $state(false)

	////
	// CALCULATED
	////

	let canEditUsers = page.data.permissions?.includes("admin.users.PUT") || page.data.user.isSuperUser

	$effect.pre(() => {
		if (!ready) {
			getUserOptions({searchString: userSearchInput})
			ready = true
		}
	});
	
</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	bind:disabled
	{onsubmit}
	{oncancel}
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
		<div class="card preset-tonal px-3 pt-3 w-full">
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
