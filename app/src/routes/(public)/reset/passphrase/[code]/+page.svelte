<script lang="ts">
	import { Main, Loading } from "$client/components"
	import { page } from "$app/stores"
	import { Toast, handleClientError, handleException, handleServerError } from "$client/utils"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import api from "$shared/api"
	import { onMount } from "svelte"
	import { NewPassphraseForm }from "$client/components"
	import { NewPassphrase } from "$shared/validation/forms"

	const toastStore = getToastStore()

	async function verify() {
		const code = $page.params.code
		await api.reset.passphrase.code$(code).GET()
			.Success(async (res) => {
				valid = true
			})
			.ClientError(handleClientError({ toastStore}, errCallback))
			.ServerError(handleServerError({ toastStore }, errCallback))
			.catch(handleException({ toastStore }, errCallback))
	}

	async function onSubmit(): Promise<void> {
		console.log(data)
		const code = $page.params.code
		await api.reset.passphrase.code$(code).PUT({ body: data })
			.Success(async (res) => {
				completed = true
				toastStore.trigger(
					new Toast({ message: res['body']['message'] || "Passphrase updated", style: "success" })
				)
			})
			.ClientError(handleClientError({ toastStore }, errCallback))
			.ServerError(handleServerError({ toastStore }, errCallback))
			.catch(handleException({ toastStore }, errCallback))
	}

	async function errCallback(err): Promise<void> {
		failure = true
	}

	let valid = false
	let completed = false
	let failure = false
	let data: FormDataOf<NewPassphrase>;

	onMount(() => {
		verify()
	})

</script>

<!-- Nice rounded wrapper, centered, fixed width at full screen, responsive -->

<Main>
	<div class="m-auto md:w-[35rem]">
        <div class="card p-4 mb-4">
            <h1 class="h2">
                {$page.data.title}
            </h1>
        </div>
		<div class="card p-4 w-full mb-4">
			{#if valid}
				<NewPassphraseForm on:submit={onSubmit} bind:data  />
			{:else if failure}
				<h1 class="text-2xl font-bold">Your passphrase could not be reset.</h1>
				<p class="text-lg">
					Please check your code or try again later.
				</p>
			{:else}
				<Loading />
			{/if}
		</div>
		{#if completed}
			<div class="card p-4">
				<p class="text-center">
					You may now <a href="/login">login</a> with your new passphrase.
				</p>
			</div>
		{/if}
	</div>
</Main>
