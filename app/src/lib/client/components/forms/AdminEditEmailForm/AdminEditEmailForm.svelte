<script lang="ts">
	import { page } from "$app/stores"
	import { FormBase, CheckboxInput, TextInput } from "$client/components"
	import type { FormSchema } from "$shared/validation/base"
	import { AdminEditEmail as Form } from "$shared/validation/forms"
	import { onMount } from "svelte"

	////
	// COMPUTED
	////
	let isLoaded = false
	$: canEditSuperUsers = $page.data.user.isSuperUser

	////
	// PARENT EXPORTS
	////

	export let result: SelectEmail

	////
	// LOCAL EXPORTS
	////
	
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors = {}

	////
	// CHILD EXPORTS
	////

	export let disabled: boolean = undefined
	export let canSubmit: boolean = undefined

	////
	// LIFECYCLE
	////

	onMount(() => {
		console.log("canEditSuperUsers", canEditSuperUsers)
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

		{#if result && $page.data.user.id === result.id}
			<div class="card mb-3">
				<section class="p-4">
					<p class="text-red-500">
						<b>Warning:</b> You are editing your own user.
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

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				id="isVerified"
				field="isVerified"
				{form}
				bind:errors
				bind:data
				{disabled}
			/>
		</div>

		<div class="card px-3 pt-2 w-100">
			<CheckboxInput
				id="isUserPrimary"
				field="isUserPrimary"
				{form}
				bind:errors
				bind:data
				{disabled}
			/>
		</div>
	</FormBase>
{/if}
