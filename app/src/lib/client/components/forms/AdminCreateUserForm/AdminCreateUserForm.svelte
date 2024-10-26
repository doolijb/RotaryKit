<script lang="ts">
	import { page, } from "$app/stores"
	import { FormBase, TextInput, PassphraseInput, CheckboxInput } from "$client/components"
	import { AdminCreateUser as Form, AdminCreateUserWithPermissions as FormWithPermissions } from "$shared/validation/forms"
	import { onMount } from "svelte"

	////
	// PROPS
	////
	

	interface Props {
		// Props
		canEditSuperUsers: boolean

		// Bindables
		data: Form["Data"] | FormWithPermissions["Data"]
		errors: FormErrors
		disabled: boolean
		canSubmit: boolean

		// Events
		onsubmit: (data: Form | FormWithPermissions) => Promise<void>
		oncancel: (args: unknown) => Promise<void>
	}

	let {
		// Props
		canEditSuperUsers,

		// Bindables
		data = $bindable({
			username: "",
			email: "",
			passphrase: "",
			isVerified: false,
			isAdmin: canEditSuperUsers ? false : undefined,
			isSuperUser: canEditSuperUsers ? false : undefined,
		}),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props();

	////
	// CONSTANTS
	////

	let form: Form | FormWithPermissions

	////
	// LIFECYCLE
	////

	onMount(() => {
		form = canEditSuperUsers ? new FormWithPermissions() : new Form()
	})
	
</script>
{#if form}
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
			label="Username"
			id="username"
			field="username"
			bind:data
			bind:errors
			{form}
			{disabled}
		/>

		<TextInput
			label="Email"
			id="email"
			field="email"
			bind:data
			bind:errors
			{form}
			{disabled}
		/>

		<PassphraseInput
			label="Passphrase"
			id="passphrase"
			field="passphrase"
			bind:data
			bind:errors
			{form}
			{disabled}
		/>

		<div class="flex space-x-3 my-5">
			<div class="card px-3 pt-3 w-full">
				<CheckboxInput
					label="Is Verified"
					id="isVerified"
					field="isVerified"
					bind:data
					bind:errors
					{form}
					{disabled}
				/>
			</div>
		</div>

		{#if canEditSuperUsers}
			<div class="flex space-x-3 my-5">
				<div class="card px-3 pt-3 w-full">
					<CheckboxInput
						label="Is Admin"
						id="isAdmin"
						field="isAdmin"
						bind:data
						bind:errors
						{form}
						{disabled}
					/>
				</div>
			</div>

			<div class="flex space-x-3 my-5">
				<div class="card px-3 pt-3 w-full">
					<CheckboxInput
						label="Is Super User"
						id="isSuperUser"
						field="isSuperUser"
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
