<script lang="ts">
	import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { page } from "$app/stores"
	import { Main } from "$client/components"
	import api from "$shared/api"
	import Icon from "@iconify/svelte"
	import { onMount } from "svelte"
	import { UserProfileImageForm } from "$client/components"
	import { handleClientError, handleException, handleServerError, Toast } from "$client/utils"
	import { Avatar } from "@skeletonlabs/skeleton"
	import { invalidateAll } from "$app/navigation"

	const toastStore = getToastStore()
	const modalStore = getModalStore()

	$: hasProfileImage = $page.data.user.profileImages.length > 0

	function getProfileImageUrl(user: SelectUser & { profileImages: SelectImage[] }) {
		const hasProfileImage = user.profileImages.length > 0

		if (hasProfileImage) {
			return user.profileImages[0]
		}
	}

	$: profileImage = getProfileImageUrl($page.data.user) as SelectImage


	async function onSubmit() {
		const formData = new FormData()

		Object.keys(data).forEach((key) => {
			if (Array.isArray(data[key])) {
				data[key].forEach((value: any) => {
					formData.append(`${key}[]`, value)
				})
			} else {
				formData.append(key, data[key])
			}
		})

		await api.profile.image
			.POST({ body: formData })
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

	let addEmailCompleted = false
	let data: UserProfileImageForm["Data"]
	let errors: FormErrors

	onMount(async () => {})
	console.log($page.data.user.profileImages)
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
						{#if profileImage}
						<picture>
							{#if profileImage.smallWebpPath}
								<source srcset={$page.data.storageUrl + profileImage.smallWebpPath} type="image/webp" />
							{/if}
							{#if profileImage.smallJpgPath}
								<source srcset={$page.data.storageUrl + profileImage.smallJpgPath} type="image/jpeg" />
							{/if}
							<img src={$page.data.storageUrl + profileImage.smallJpgPath} alt="Profile Image" class="rounded-full" />
						</picture>
						{/if}
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
							on:click={onDelete}
							disabled={!hasProfileImage}
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
				<UserProfileImageForm bind:data bind:errors on:submit={onSubmit} />
			{/if}
		</div>
	</div>
</Main>

<style>
	img {
		image-rendering: -webkit-optimize-contrast; /* Webkit (Chrome, Safari) */
		image-rendering: crisp-edges; /* Firefox */
		image-rendering: pixelated; /* CSS4 */
	}
</style>
