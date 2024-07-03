<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { goto } from "$app/navigation"
	import { Main, UserLoginForm } from "$client/components"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/stores"
	import api from "$shared/api"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import type { UserLogin } from "$shared/validation/forms"

	const toastStore = getToastStore()

	let completed: boolean = false
	

	async function onSubmit() {
		await api.login.POST({body: data})
			.Success(async (res) => {
				console.log(res)
				completed = true
				const nextPage: string = $page.url.searchParams.get("next") || "/"
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: `Welcome back`, style: "success" })
				)
				await goto(nextPage)
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
