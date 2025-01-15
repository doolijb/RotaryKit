<script lang="ts">
	import { page } from "$app/state"
	import { FormBase, MultiSelect } from "$client/components"
	import { AdminEditAdminRolesToUser as Form } from "$shared/validation/forms"
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"


	export const form = Form.init()


	////
	// PROPS
	////

	interface Props {
		// Props
		adminRoles: SelectAdminRole[]
		result: SelectUser & {
			toAdminRoles: (
				SelectUsersToAdminRoles & { adminRole: SelectAdminRole }
			)[]
		}

		// Bindables
		data?: Form["Data"]
		errors?: FormErrors
		disabled?: boolean
		canSubmit?: boolean

		// Events
		onsubmit: (e: Event) => Promise<void>
		oncancel: (e: Event) => Promise<void>
	}

	let {
		// Props
		adminRoles,
		result,

		// Bindables
		data = $bindable({ adminRoles: [] }),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props();

	////
	// STATE
	////

	let isPopulated = $state(false)

	////
	// COMPUTED
	////

	let adminRoleOptions: MultiSelectOption[]= $state([])
	
	////
	// LIFECYCLE
	////

	$effect.pre(() => {
		if (!isPopulated && !!result) {
			isPopulated = true

			adminRoleOptions = adminRoles.map((role) => ({
				key: role.id,
				label: role.name
			}))

			if (data.adminRoles === undefined) {
				data.adminRoles = []
			}

			Object.values(result.toAdminRoles).forEach(
				({ adminRole }: { adminRole: SelectAdminRole }) => {
					data.adminRoles.push(adminRole.id)
				}
			)

			form.validate({data}).then((result) => {
				errors = result
			})

			if (!result.isAdmin) {
				canSubmit = false
				disabled = true
			}
		}
	})

</script>

<FormBase
	{form}
	bind:errors
	bind:data
	bind:canSubmit
	bind:disabled
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
>
	{#if result && page.data.user.id === result.id}
		<div class="card mb-3 preset-filled-error">
			<section class="p-4">
				<p>
					<Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> You are editing your own admin roles.
					This may result in you losing access to this page.
				</p>
			</section>
		</div>
	{/if}

	{#if result && result.isAdmin && result.toAdminRoles.length === 0}
		<div class="card mb-3 preset-filled-error">
			<section class="p-4">
				<p>
					<Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> This user has no admin roles.
					They will not be able to view or modify any data.
				</p>
			</section>
		</div>
	{/if}

	{#if result && !result.isAdmin}
		<div class="card mb-3 preset-filled-error">
			<section class="p-4">
				<p>
					<Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> This user is not an admin.
					Admin roles do not apply.
				</p>
			</section>
		</div>
	{/if}

	{#if result && result.isSuperUser}
		<div class="card mb-3 preset-filled-error">
			<section class="p-4">
				<p>
					<Icon icon="icon-park-outline:caution" class="me-1 inline" height="1.5em" /> This user is a <u>super user</u>.
					All admin permissions are bypassed.
				</p>
			</section>
		</div>
	{/if}

	{#if !adminRoleOptions.length}
		<div class="card mb-3 preset-filled-warning">
			<section class="p-4">
				<p class="">
					<Icon icon="mdi:info-outline" class="me-1 inline" height="1.5em" />
					No admin roles have been created yet. <a href="/admin/adminRoles/create" class="link hover:underline">Click here to create one.</a>
				</p>
			</section>
		</div>
	{/if}

	<MultiSelect
		id="adminRoles"
		field="adminRoles"
		size={10}
		{form}
		bind:errors
		bind:data
		options={adminRoleOptions}
		disabled={disabled || !adminRoleOptions.length}
	/>
</FormBase>
