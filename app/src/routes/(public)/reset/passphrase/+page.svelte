<script lang="ts">
	import { Main, RecoverPassphraseByEmailForm } from "$client/components"
	import { handleClientError, handleServerError, handleException } from "$client/utils"
	import { page } from "$app/state"
	import api from "$shared/api"
	import type { RecoverPassphraseByEmail } from "$shared/validation/forms"
	import type { ToastContext } from "@skeletonlabs/skeleton-svelte"

	const toast: ToastContext = getContext("toast")

	let completed: boolean = $state(false)
	let email: string = $state()

	async function onsubmit() {
		email = data.email
		await api.reset.passphrase.POST({body: data})
			.Success(async (res) => {
				completed = true
				const nextPage: string = page.url.searchParams.get("next") || "/"
			})
			.ClientError((r) => { 
				if ("errors" in r.body) {
					errors = r.body.errors
				}
                return handleClientError({ errors, toast})(r)
            })
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
	}

	let data: FormDataOf<RecoverPassphraseByEmail> = $state()
	let errors: FormErrors = $state()

</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{page.data.title}
			</h1>
		</div>
		{#if completed}
			<div class="card p-4 mb-4">
				<h2 class="h3 mb-2">Check your email</h2>
				<p class="mb-2 text-success">
					You may receive an email to <u>{email}</u> with instructions to reset your passphrase if it is associated with an existing account.
				</p>
				<p>
					If you don't receive an email within a few minutes, please check your spam folder.
				</p>
			</div>
		{:else}
		<div class="card border-0 p-4 mb-4">
			<RecoverPassphraseByEmailForm {onsubmit} bind:data bind:errors />
		</div>
		<div class="card preset-filled-surface-500 p-4 mb-4">
			<p class="text-center">
				Don't have an account?
				<a href="/register" class="btn btn-sm preset-filled-secondary">Register</a>
			</p>
		</div>
		<div class="card p-4 mb-4">
			<p class="text-center">
				Change your mind?
				<a href="/login" class="btn btn-sm preset-filled-secondary">Login</a>
			</p>
		</div>
		{/if}
	</div>
</Main>
