<script lang="ts">
	import { page, } from "$app/stores"
	import { FormBase, TextInput, PassphraseInput, CheckboxInput } from "$components"
	import { AdminCreateUser as Form, AdminCreateUserWithPermissions as FormWithPermissions } from "$validation/forms"
	
	////
	// PARENT EXPORTS
	////

	export let canEditSuperUsers: boolean

	////
	// LOCAL EXPORTS
	////

	const form: Form | FormWithPermissions = canEditSuperUsers ? new FormWithPermissions() : new Form()
	export let data: typeof form["Data"] = {
		username: "",
		email: "",
		passphrase: "",
		isVerified: false,
		isAdmin: canEditSuperUsers ? false : undefined,
		isSuperUser: canEditSuperUsers ? false : undefined,
	}
	export let errors: FormErrors = {}

	////
	// DOWNSTREAM EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined
	
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
