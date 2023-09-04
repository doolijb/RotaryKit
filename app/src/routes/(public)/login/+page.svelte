<script lang="ts">
	import { goto } from "$app/navigation"
	import { Main, UserLoginForm } from "$client/components"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/stores"
	import api from "$shared/api"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { UserLogin } from "$shared/validation/forms"

	const toastStore = getToastStore()

	let completed = false
	

	async function onsubmit() {
		await api.login.POST({body: data})
			.Success(async (res) => {
				completed = true
				const nextPage: string = $page.url.searchParams.get("next") || "/"
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: `Welcome back`, style: "success" })
				)
				await goto(nextPage)
			})
			.ClientError((r) => { 
                errors = r.body["errors"] || {}
                return handleClientError({ errors, toastStore})(r)
            })
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	let data: FormDataOf<UserLogin> = $state({})
	let errors: FormErrors = $state({})

</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{$page.data.title}
			</h1>
		</div>
		<div class="card border-0 p-4 mb-4">
			<UserLoginForm {onsubmit} bind:data bind:errors />
		</div>
		<div class="card p-4 mb-4">
			<p class="text-center">
				Don't have an account?
				<a href="/register" class="btn btn-sm variant-filled-secondary">Register</a>
			</p>
		</div>
		<div class="card p-4 mb-4">
			<p class="text-center">
				Forgot your passphrase?
				<a href="/reset/passphrase" class="btn btn-sm variant-filled-secondary">Reset</a>
			</p>
		</div>
	</div>
</Main>
