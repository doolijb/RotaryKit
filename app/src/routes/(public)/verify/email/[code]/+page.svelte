<script lang="ts">
	import { Main, Loading } from "$client/components"
	import { page } from "$app/state"
	import { invalidateAll } from "$app/navigation"
	import { handleClientError, handleException, handleServerError } from "$client/utils"
	import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import api from "$shared/api"
	import { getContext, onMount } from "svelte"

	const toast: ToastContext = getContext("toast")
	const isCodeValid = null

	async function verify() {
		const code = page.params.code
		await api.verify.email.code$(code).GET()
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toast.create({ 
					description: "Your email has been verified", 
					type: "success" 
				})
				completed = true
			})
			.ClientError(handleClientError({ toast}, errCallback))
			.ServerError(handleServerError({ toast }, errCallback))
			.catch(handleException({ toast }, errCallback))
	}

	async function errCallback(err): Promise<void> {
		failure = true
	}

	let completed = $state(false)
	let failure = $state(false)

	onMount(() => {
		verify()
	})

</script>

<!-- Nice rounded wrapper, centered, fixed width at full screen, responsive -->

<Main>
	<div class="m-auto md:w-[35rem]">
        <div class="card p-4 mb-4">
            <h1 class="h2">
                {page.data.title}
            </h1>
        </div>
		<div class="card p-4 w-full mb-4">
			<container class="container">
				<div class="flex flex-col items-center justify-center space-y-4">
					{#if completed}
						<h1 class="text-2xl font-bold">Your email address is verified!</h1>
						<p class="text-lg">
							{#if page.data.user}
								You may continue browsing the <a href="/">site</a>.
							{:else}
								You may now <a href="/login">login</a>.
							{/if}
						</p>
					{:else if failure}
						<h1 class="text-2xl font-bold">Your email address could not be verified.</h1>
						<p class="text-lg">
							Please check your verification code or try again later.
						</p>
					{:else}
						<Loading />
					{/if}
				</div>
			</container>
		</div>
		{#if completed}
			<div class="card p-4">
				<p class="text-center">
					{#if page.data.user}
						<a href="/" class="btn btn-sm preset-filled-secondary">Home</a>
					{:else}
						<a href="/login" class="btn btn-sm preset-filled-secondary">Login</a>
					{/if}
				</p>
			</div>
		{/if}
	</div>
</Main>
