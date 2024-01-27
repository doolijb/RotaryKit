<script lang="ts">
	import { goto } from "$app/navigation"
	import { Main, UserLoginForm } from "$components"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/stores"
	import api from "$lib/shared/api"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$validation/base"
	import type { UserLogin } from "$validation/forms"

	const toastStore = getToastStore()

	let completed = false

	async function onSubmit() {
		await api.login.POST({body: data})
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: `Welcome back, ${$page.data.user.username}`, style: "success" })
				)
				await goto("/")
			})
			.ClientError(handleClientError({ errors, toastStore}))
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	let form: FormSchema
	let data: FormDataOf<UserLogin>
	let errors: FormErrors

</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{$page.data.title}
			</h1>
		</div>
		<div class="card border-0 p-4 mb-4">
			<UserLoginForm on:submit={onSubmit} bind:form bind:data bind:errors />
		</div>
		<div class="card p-4">
			<p class="text-center">
				Don't have an account?
				<a href="/register" class="btn btn-sm variant-filled-secondary">Register</a>
			</p>
		</div>
	</div>
</Main>
