<script lang="ts">
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { page } from "$app/stores"
	import { Main } from "$client/components"
	import api from "$shared/api"
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"
	import { AddEmailAddressForm } from "$client/components"
	import { handleClientError, handleException, handleServerError, Toast } from "$client/utils"
	import { AddEmailAddress as Form } from "$shared/validation/forms"

	const toastStore = getToastStore()
	const modalStore = getModalStore()


	////
	// STATE
	////

	let emails = $state<SelectEmail[]>([])
	let addEmailCompleted = $state(false)
	let addEmailData = $state({} as Form["Data"])
	let addEmailErrors: FormErrors = $state({})
	let deletedEmailIds: string[] = [] // Prevent button from being clicked multiple times
	let isSettingPrimary = $state(false)

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
				toastStore.trigger(new Toast({ message: "Your email was added", style: "success" }))
			})
			.ClientError((r) => {
				addEmailErrors = r.body.errors
				return handleClientError({ errors: addEmailErrors, toastStore })(r)
			})
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	async function onSetPrimaryClick(email: SelectEmail) {
		const modal: ModalSettings = {
			type: "confirm",
			title: "Change Primary Email Address",
			body: `Are you sure you want to make ${email.address} your primary email address for all future authentication and communications? You will no longer be able to login with your current primary email address.`,
			response: (r: boolean) => {
				if (r) {
					onSetPrimaryConfirmClick(email)
				}
			}
		}
		modalStore.trigger(modal)
	}

	async function onSetPrimaryConfirmClick(email: SelectEmail) {
		isSettingPrimary = true
		await api.profile.email
			.resourceId$(email.id)
			["set-user-primary"].PUT()
			.Success(async (res) => {
				emails = []
				getEmails()
				toastStore.trigger(new Toast({ message: res.body.message || "Primary email updated", style: "success" }))
			})
			.ClientError(handleClientError({ toastStore }))
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
		isSettingPrimary = false
	}

	async function onResendCodeClick(email: SelectEmail) {
		await api.profile.email
			.resourceId$(email.id)
			["resend-code"].POST()
			.Success(async (res) => {
				toastStore.trigger(new Toast({ message: "Verification email sent", style: "success" }))
			})
			.ClientError(handleClientError({ toastStore }))
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	async function onDeleteEmailClick(email: SelectEmail) {
		const modal: ModalSettings = {
			type: "confirm",
			title: "Delete Email Address",
			body: `Are you sure you want to delete the email address ${email.address}?`,
			response: (r: boolean) => {
				if (r) {
					onDeleteEmailConfirmClick(email)
				}
			}
		}
		modalStore.trigger(modal)
	}

	async function onDeleteEmailConfirmClick(email: SelectEmail) {
		deletedEmailIds.push(email.id)
		await api.profile.email
			.resourceId$(email.id)
			.DELETE()
			.Success(async (res) => {
				getEmails()
				toastStore.trigger(new Toast({ message: "Your email was deleted", style: "success" }))
			})
			.ClientError(handleClientError({ toastStore }))
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
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

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{$page.data.title}
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
                            <Icon icon="mdi:settings" class="w-5 h-5 text-surface-900" />
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
									class="btn btn-sm variant-filled-warning" 
									onclick={() => onResendCodeClick(email)}
								>
									Resend Verification Email
								</button>
							{/if}
						</td>
						<td>
							{#if email.isUserPrimary}
								<Icon icon="mdi:check" class="w-6 h-6 text-green-500" />
							{:else if email.verifiedAt}
								<button
									class="btn btn-sm variant-filled-surface hover:variant-filled-secondary"
									onclick={() => onSetPrimaryClick(email)}
									disabled={isSettingPrimary}
								>
									Set Primary
								</button>
							{:else}
								<Icon icon="mdi:cross-circle" class="w-6 h-6 text-surface-300" />
							{/if}
						</td>
						{#if isShowControlColumn}
							<td>
								{#if !email.isUserPrimary && emails.length > 1}
									<button
										class="btn btn-sm variant-filled-surface hover:variant-filled-error btn-secondary"
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
