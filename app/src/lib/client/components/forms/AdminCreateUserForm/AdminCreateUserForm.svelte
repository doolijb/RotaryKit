<script lang="ts">
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
	// CALCULATED
	////

	let form = $state(canEditSuperUsers ? FormWithPermissions.init() : Form.init())

	
</script>
{#if form}
	<FormBase
		{form}
		{onsubmit}
		{oncancel}
		showSubmit={false}
		showCancel={false}
	>
		<TextInput
			label="Username"
			id="username"
			field="username"
			{form}
			{disabled}
		/>

		<TextInput
			label="Email"
			id="email"
			field="email"
			{form}
			{disabled}
		/>

		<PassphraseInput
			label="Passphrase"
			id="passphrase"
			field="passphrase"
			{form}
			{disabled}
		/>

		<div class="flex space-x-3 my-5">
			<div class="card preset-tonal px-3 pt-3 w-full">
				<CheckboxInput
					{form}
					label="Is Verified"
					id="isVerified"
					field="isVerified"
					{disabled}
				/>
			</div>
		</div>

		{#if canEditSuperUsers}
			<div class="flex space-x-3 my-5">
				<div class="card preset-tonal px-3 pt-3 w-full">
					<CheckboxInput
						{form}
						label="Is Admin"
						id="isAdmin"
						field="isAdmin"
						{disabled}
					/>
				</div>
			</div>

			<div class="flex space-x-3 my-5">
				<div class="card preset-tonal px-3 pt-3 w-full">
					<CheckboxInput
						{form}
						label="Is Super User"
						id="isSuperUser"
						field="isSuperUser"
						{disabled}
					/>
				</div>
			</div>
		{/if}
	</FormBase>
{/if}
