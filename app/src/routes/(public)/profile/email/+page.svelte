<script lang="ts">
	import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import { page } from "$app/state"
	import { ConfirmationModal, Main } from "$client/components"
	import api from "$shared/api"
	import * as Icon from "lucide-svelte"
	import { getContext, onMount } from "svelte"
	import { AddEmailAddressForm } from "$client/components"
	import { handleClientError, handleException, handleServerError } from "$client/utils"
	import { AddEmailAddress as Form } from "$shared/validation/forms"

	const toast: ToastContext = getContext("toast")


	////
	// STATE
	////

	let emails = $state<SelectEmail[]>([])
	let addEmailCompleted = $state(false)
	let addEmailData = $state({} as Form["Data"])
	let addEmailErrors: FormErrors = $state({})
	let deletedEmailIds: string[] = [] // Prevent button from being clicked multiple times
	let isSettingPrimary = $state(false)
	let isSetPrimaryModalOpen = $state(false)
	let isDeleteEmailModalOpen = $state(false)
	let setPrimaryModalData: {email?: SelectEmail} = $state({})
	let deleteEmailModalData: {email?: SelectEmail} = $state({})

	////
	// CALCULATED
	////

	let isShowControlColumn = $derived(emails.length > 1)

	////
	// FUNCTIONS
	////

	async function onAddEmailSubmit() {
		await api.profile.email
			.POST({ body: addEmailData })
			.Success(async (res) => {
				getEmails()
				addEmailCompleted = true
				toast.create({ description: "Your email was added", type: "success" })
			})
			.ClientError((r) => {
				addEmailErrors = r.body.errors
				return handleClientError({ toast })(r)
			})
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
	}

	async function onSetPrimaryClick(email: SelectEmail) {
		setPrimaryModalData = { email }
		isSetPrimaryModalOpen = true
	}

	async function onSetPrimaryModalConfirm({email}:{email: SelectEmail}) {
		isSettingPrimary = true
		await api.profile.email
			.resourceId$(email.id)
			["set-user-primary"].PUT()
			.Success(async (res) => {
				emails = []
				getEmails()
				toast.create({ description: res.body.message || "Primary email updated", type: "success" })
			})
			.ClientError(handleClientError({ toast }))
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
		isSettingPrimary = false
		isSetPrimaryModalOpen = false
		setPrimaryModalData = {}
	}

	async function onResendCodeClick(email: SelectEmail) {
		await api.profile.email
			.resourceId$(email.id)
			["resend-code"].POST()
			.Success(async (res) => {
				toast.create({description: "Verification email sent", type: "success" })
			})
			.ClientError(handleClientError({ toast }))
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
	}

	async function onDeleteEmailClick(email: SelectEmail) {
		deleteEmailModalData = { email }
		isDeleteEmailModalOpen = true
	}

	async function onDeleteEmailModalConfirm(email: SelectEmail) {
		deletedEmailIds.push(email.id)
		await api.profile.email
			.resourceId$(email.id)
			.DELETE()
			.Success(async (res) => {
				getEmails()
				toast.create({ description: "Your email was deleted", type: "success" })
			})
			.ClientError(handleClientError({ toast }))
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
		deleteEmailModalData = {}
	}

	async function getEmails() {
		api.profile.email.GET().Ok((res) => {
			emails = res.body.emails as SelectEmail[]
		})
	}

	////
	// LIFECYCLE
	////

	onMount(async () => {
		getEmails()
	})
</script>

<ConfirmationModal
	title="Change Primary Email Address"
	body="Are you sure you want to make {setPrimaryModalData.email.address} your primary email address for all future authentication and communications? You will no longer be able to login with your current primary email address."
	onConfirm={onSetPrimaryModalConfirm}
	data={setPrimaryModalData}
/>

<ConfirmationModal
	title="Delete Email Address"
	body="Are you sure you want to delete {deleteEmailModalData.email.address}?"
	onConfirm={onDeleteEmailModalConfirm}
	data={deleteEmailModalData}
/>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{page.data.title}
			</h1>
		</div>
	</div>

	<div class="m-auto md:w-[35rem]">
		<table class="table table-hover w-full mb-4">
			<thead>
				<tr>
					<th class="text-start">Email Address</th>
					<th class="text-start">Verified At</th>
					<th class="text-start">Is Primary</th>
					{#if isShowControlColumn}
						<th class="text-start">
                            <Icon.Settings class="w-5 h-5 text-surface-900" />
                        </th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each emails as email}
					<tr class="content-center">
						<td>{email.address}</td>
						<td>
							{#if email.verifiedAt}
								{new Date(email.verifiedAt).toLocaleDateString()}
							{:else}
								<button 
									class="btn btn-sm preset-filled-warning" 
									onclick={() => onResendCodeClick(email)}
								>
									Resend Verification Email
								</button>
							{/if}
						</td>
						<td>
							{#if email.isUserPrimary}
								<Icon.Check class="w-6 h-6 text-green-500" />
							{:else if email.verifiedAt}
								<button
									class="btn btn-sm preset-filled-surface hover:preset-filled-secondary"
									onclick={() => onSetPrimaryClick(email)}
									disabled={isSettingPrimary}
								>
									Set Primary
								</button>
							{:else}
								<Icon.CirclePlus class="w-6 h-6 text-surface-300" />
							{/if}
						</td>
						{#if isShowControlColumn}
							<td>
								{#if !email.isUserPrimary && emails.length > 1}
									<button
										class="btn btn-sm preset-filled-surface hover:preset-filled-error btn-secondary"
										onclick={() => onDeleteEmailClick(email)}
										disabled={deletedEmailIds.includes(email.id)}
									>
										Delete
									</button>
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0 mb-4">
			<p>Your primary address is used for login and communications.</p>
			<p>Additional email addresses may be used for account recovery.</p>
		</div>
	</div>

	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h2 class="h3 mb-3">Add Email Address</h2>
			{#if addEmailCompleted}
				<div class="alert alert-success">
					A verification email has been sent to your new email address. Please check your inbox and
					click the link to verify your email address.
				</div>
			{:else}
				<AddEmailAddressForm
					bind:data={addEmailData}
					bind:errors={addEmailErrors}
					onsubmit={onAddEmailSubmit}
				/>
			{/if}
		</div>
	</div>
</Main>

<style></style>
