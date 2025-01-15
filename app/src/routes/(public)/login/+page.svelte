<script lang="ts">
	import { goto } from "$app/navigation"
	import { Main, UserLoginForm } from "$client/components"
	import { invalidateAll } from "$app/navigation"
	import { handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/state"
	import api from "$shared/api"
	import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import type { UserLogin } from "$shared/validation/forms"
	import { getContext } from "svelte"

	const toast: ToastContext = getContext("toast")

	let completed = false

	async function onsubmit() {
		await api.login.POST({body: data})
			.Success(async (res) => {
				completed = true
				const nextPage: string = page.url.searchParams.get("next") || "/"
				await invalidateAll()
				toast.create({ 
					description: `Welcome back`, 
					type: "success" 
				})
				await goto(nextPage)
			})
			.ClientError(handleClientError({ toast}))
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
	}

	let data: FormDataOf<UserLogin> = $state({
		email: "",
		passphrase: ""
	})
	let errors: FormErrors = $state({})

</script>

<Main>
	<div class="m-auto md:w-[35rem] flex flex-col gap-4">
		<h1 class="h2">
			{page.data.title}
		</h1>
		<div class="card preset-tonal border-0 p-4">
			<UserLoginForm {onsubmit} bind:data bind:errors />
		</div>
		<div class="card preset-tonal p-4">
			<p class="text-center">
				Don't have an account?
				<a href="/register" class="btn btn-sm preset-filled-primary-500">Register</a>
			</p>
		</div>
		<div class="card preset-tonal p-4">
			<p class="text-center">
				Forgot your passphrase?
				<a href="/reset/passphrase" class="btn btn-sm preset-filled-primary-500">Reset</a>
			</p>
		</div>
	</div>
</Main>
