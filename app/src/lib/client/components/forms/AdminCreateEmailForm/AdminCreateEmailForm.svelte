<script lang="ts">
	import { page } from "$app/state"
	import { FormBase, Input, CheckboxInput } from "$client/components"
	import ModalSelectField from "$client/components/fields/ModalSelectField"
	import { AdminCreateEmail as Form } from "$shared/validation/forms"

	let form = $state(Form.init())

	////
	// Props
	////

	interface Props {
		// Props

		// Bindables
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
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
	defaultValues={{
		address: "",
		isVerified: false,
		isUserPrimary: false,
		userId: null,
	}}
>

	<Input
		id="address"
		field="address"
		{form}
	/>

	{#if canEditUsers}
		<ModalSelectField
			id="userId"
			field="userId"
			{form}
			getOptions={getUserOptions}
			mapOptions={mapUserOptions}
		/>
	{/if}

	<div class="flex space-x-3 my-5">
		<div class="card preset-tonal px-3 pt-3 w-full">
			<CheckboxInput
				id="isVerified"
				field="isVerified"
				{form}
			/>
		</div>
	</div>

	{#if canEditUsers}
		<div class="flex space-x-3 my-5">
			<div class="card px-3 pt-3 w-full">
				<CheckboxInput
					id="isUserPrimary"
					field="isUserPrimary"				
					{form}
				/>
			</div>
		</div>
	{/if}
</FormBase>
