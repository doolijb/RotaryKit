<script lang="ts">
	import { Main, ChangePassphraseForm } from "$client/components"
	import { page } from "$app/stores"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleException, handleServerError } from "$client/utils"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import api from "$shared/api"

	const toastStore = getToastStore()

	async function onSubmit() {
		await api.profile.passphrase.PUT({body: data})
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: "Your passphrase has been updated", style: "success" })
				)
				completed = true
			})
			.ClientError((r) => { 
                errors = r.body.errors
                return handleClientError({ errors, toastStore})(r)
            })
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	let completed = false
	let data: ChangePassphraseForm["Data"]
	let errors: FormErrors

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
			<container class="container">
				{#if !completed}
					<ChangePassphraseForm on:submit={onSubmit} bind:data bind:errors />
				{:else}
					<div class="flex flex-col items-center justify-center space-y-4">
						<h1 class="text-2xl font-bold">Success</h1>
						<p class="text-lg">
							<a href="/profile">Click here to return to your profile.</a>
						</p>
					</div>
				{/if}
			</container>
		</div>
	</div>
</Main>
