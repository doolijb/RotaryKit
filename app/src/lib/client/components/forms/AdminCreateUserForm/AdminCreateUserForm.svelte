<script lang="ts">
	import { page, } from "$app/stores"
	import { FormBase, BasicTextInput, PassphraseInput, CheckboxInput } from "$components"
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

	export let disabled:boolean
	export let canSubmit: boolean

	////
	// COMPUTED
	////
	
</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	on:submit
	on:cancel
	showSubmit={false}
	showCancel={false}
>
	<BasicTextInput
		label="Username"
		id="username"
		type="username"
		bind:value={data.username}
		bind:fieldValidator={form.fields.username}
		bind:fieldErrors={errors.username}
		{disabled}
	/>

	<BasicTextInput
		label="Email"
		id="email"
		type="email"
		bind:value={data.email}
		bind:fieldValidator={form.fields.email}
		bind:fieldErrors={errors.email}
		{disabled}
	/>

	<PassphraseInput
		label="Passphrase"
		id="passphrase"
		bind:value={data.passphrase}
		bind:fieldValidator={form.fields.passphrase}
		bind:fieldErrors={errors.passphrase}
		{disabled}
	/>

	<div class="flex space-x-3 my-4">
		<div class="card px-3 py-2">
			<CheckboxInput
				label="Is Verified"
				type="checkbox"
				id="isVerified"
				bind:checked={data.isVerified}
				bind:fieldValidator={form.fields.isVerified}
				{disabled}
			/>
		</div>

		{#if canEditSuperUsers}
			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Admin"
					type="checkbox"
					id="isAdmin"
					bind:fieldErrors={errors.isAdmin}
					bind:checked={data["isAdmin"]}
					bind:fieldValidator={form.fields["isAdmin"]}
					{disabled}
				/>
			</div>
		{/if}

		{#if canEditSuperUsers}
			<div class="card px-3 py-2">
				<CheckboxInput
					label="Is Super User"
					type="checkbox"
					id="isSuperUser"
					bind:checked={data["isSuperUser"]}
					bind:fieldValidator={form.fields["isSuperUser"]}
					{disabled}
				/>
			</div>
		{/if}
	</div>
</FormBase>
