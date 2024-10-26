<script lang="ts">
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { page } from "$app/stores"
	import { ImageView, Main } from "$client/components"
	import api from "$shared/api"
	import Icon from "@iconify/svelte"
	import { UserProfileImageForm } from "$client/components"
	import { handleClientError, handleException, handleServerError, Toast, useFormData } from "$client/utils"
	import { Avatar } from "@skeletonlabs/skeleton"
	import { invalidateAll } from "$app/navigation"
	import type { UserProfileImage as Form } from "$shared/validation/forms"


	const toastStore = getToastStore()
	const modalStore = getModalStore()

	////
	// VARIABLES
	////

	let addEmailCompleted = false

	////
	// STATE
	////

	let data = $state({} as Form["Data"])
	let errors: FormErrors = $state({})

	////
	// CALCULATED
	////

	let profileImage = $derived(getProfileImage($page.data.user) as SelectImage)

	////
	// FUNCTIONS
	////

	function getProfileImage(user: SelectUser & { profileImages: SelectImage[] }) {
		if (user.profileImages.length > 0) {
			return user.profileImages[0]
		}
	}

	async function onsubmit() {
		const body = useFormData({data})

		await api.profile.image
			.POST({ body })
			.Success(async (res) => {
				// addEmailCompleted = true
				toastStore.trigger(
					new Toast({ message: "Your profile image is updated", style: "success" })
				)
				data.image = []
			})
			.ClientError((r) => {
				errors = r.body.errors
				return handleClientError({ errors: errors, toastStore })(r)
			})
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
		await invalidateAll()
	}

	async function handleDelete(response: boolean) {
		if (response) {
			await api.profile.image.DELETE().Success(async (res) => {
				toastStore.trigger(
					new Toast({ message: "Your profile image is deleted", style: "success" })
				)
			}).ClientError((r) => {
				errors = r.body ? r.body["errors"] || {} : {}
				return handleClientError({ errors: errors, toastStore })(r)
			}).ServerError(handleServerError({ toastStore })).catch(handleException({ toastStore }))
			await invalidateAll()
		}
	}

	async function onDelete() {
		modalStore.trigger({
			type: "confirm",
			title: "Delete Profile Image",
			body: "Are you sure you want to delete your profile image?",
			response: handleDelete,
		})
	}

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
		<div class="card p-4 mb-4 border-0">
			<div class="grid sm:grid-cols-1 md:grid-cols-2">
				<div class="flex">
					<span>
						<Avatar class="w-[10em]" background="bg-tertiary-400-500-token" initials={!profileImage ? $page.data.user.username : undefined}>
							{#key profileImage}
								{#if !!profileImage}
									<ImageView result={profileImage} alt={$page.data.user.username} />
								{/if}
							{/key}
						</Avatar>
					</span>
				</div>
				<div>
					<h2 class="h3 mb-3">Current Profile Image</h2>
					<p>
						Your profile image helps other users recognize you.
					</p>
					<p class="pt-2">
						<button 
							class="btn variant-filled-error"
							onclick={onDelete}
							disabled={!!profileImage}
						>
						<Icon icon="bi:trash" class="mr-2" />
							Delete
						</button>
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h2 class="h3 mb-3">Upload New Profile Image</h2>
			{#if addEmailCompleted}
				<div class="alert alert-success">
					A verification email has been sent to your new email address. Please check your inbox and
					click the link to verify your email address.
				</div>
			{:else}
				<UserProfileImageForm bind:data bind:errors {onsubmit} />
			{/if}
		</div>
	</div>
</Main>
