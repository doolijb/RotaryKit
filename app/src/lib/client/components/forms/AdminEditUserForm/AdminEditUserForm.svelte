<script lang="ts">
	import { page } from "$app/state"
	import { FormBase, CheckboxInput, TextInput } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import { AdminEditUser as Form, AdminEditUserWithPermissions as FormWithPermissions } from "$shared/validation/forms"
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"

	////
	// PROPS
	////

	interface Props {
		// Props
		result: SelectUser

		// Bindables
		disabled: boolean
		form?: FormSchema
		data?: Form["Data"] | FormWithPermissions["Data"]
		errors?: FormErrors
		canSubmit?: boolean

		// Events
		onsubmit?: (e: Event) => void
		oncancel?: (e: Event) => void
	}

	let {
		// Props
		result,

		// Bindables
		disabled = $bindable(false),
		form = $bindable(),
		data = $bindable({} as Form["Data"] | FormWithPermissions["Data"]),
		errors = $bindable({}),
		canSubmit = $bindable(false)


	}: Props = $props();

	////
	// STATE
	////

	let isLoaded = $state(false)

	////
	// LIFECYCLE
	////

	onMount(() => {
		if (canEditSuperUsers) {
			form = FormWithPermissions.init()
		} else {
			form = Form.init()
		}
		data = {
			username: "",
			isVerified: false,
			isActive: false,
		}
		if (canEditSuperUsers) {
			data["isAdmin"] = false
			data["isSuperUser"] = false
		}
		data.username = result.username
		data.isVerified = !!result.verifiedAt
		data.isActive = result.isActive
		if (canEditSuperUsers) {
			data["isAdmin"] = result.isAdmin
			data["isSuperUser"] = result.isSuperUser
		}
		isLoaded = true
	})

	////
	// CALCULATED
	////

	let canEditSuperUsers = $derived(page.data.user.isSuperUser)

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

		{#if result && page.data.user.id === result.id}
			<div class="card mb-3 preset-filled-error">
				<section class="p-4">
					<p>
						<Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> You are editing your own user.
						This may result in you losing access to your account.
					</p>
				</section>
			</div>
		{/if}

		<TextInput
			label="Username"
			id="username"
			field="username"
			{form}
			bind:errors
			bind:data
			{disabled}
		/>

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				id="isVerified"
				field="isVerified"
				{form}
				{disabled}
				bind:errors
				bind:data
			/>
		</div>

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				id="isActive"
				field="isActive"
				{form}
				{disabled}
				bind:errors
				bind:data
			/>
		</div>

		{#if canEditSuperUsers}
			<div class="card px-3 pt-2 w-100">
				<CheckboxInput
					id="isAdmin"
					field="isAdmin"
					{form}
					{disabled}
					bind:errors
					bind:data
				/>
			</div>

			<div class="card px-3 pt-2 w-100">
				<CheckboxInput
					id="isSuperUser"
					field="isSuperUser"
					{form}
					{disabled}
					bind:errors
					bind:data
				/>
			</div>
		{/if}
	</FormBase>
{/if}
