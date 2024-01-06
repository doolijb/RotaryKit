<script lang="ts">
	import { goto } from "$app/navigation"
	import { Main, UserLoginForm } from "$components"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/stores"
	import api from "$src/api"
	import { getToastStore } from "@skeletonlabs/skeleton"

	const toastStore = getToastStore()

	let completed = false

	async function handleSubmit() {
		await api.login.POST({body: formData})
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: `Welcome back, ${$page.data.user.username}`, style: "success" })
				)
				await goto("/")
			})
			.ClientError(handleClientError({ formErrors, toastStore}))
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	let formData
	let formErrors
</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{$page.data.title}
			</h1>
		</div>
		<div class="card border-0 p-4 mb-4">
			<UserLoginForm on:submit={handleSubmit} bind:formData bind:formErrors />
		</div>
		<div class="card p-4">
			<p class="text-center">
				Don't have an account?
				<a href="/register" class="btn btn-sm variant-filled-secondary">Register</a>
			</p>
		</div>
	</div>
</Main>
