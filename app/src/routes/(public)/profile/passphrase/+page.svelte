<script lang="ts">
	import { Main, ChangePassphraseForm } from "$client/components"
	import { page } from "$app/state"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleException, handleServerError } from "$client/utils"
	import { gettoast } from "@skeletonlabs/skeleton-svelte"
	import api from "$shared/api"
	import type { ChangePassphrase as Form } from "$shared/validation/forms"

	const toast: ToastContext = getContext("toast")

	////
	// COMPUTED
	////

	let completed = $state(false)
	let data = $state({} as Form["Data"])
	let errors: FormErrors = $state({})

	////
	// FUNCTIONS
	////

	async function onsubmit() {
		await api.profile.passphrase.PUT({body: data})
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toast.create({ 
					description: "Your passphrase has been updated", 
					type: "success" 
				})
				completed = true
			})
			.ClientError((r) => { 
                errors = r.body.errors
                return handleClientError({ toast})(r)
            })
			.ServerError(handleServerError({ toast }))
			.catch(handleException({ toast }))
	}

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
				{#if !completed}
					<ChangePassphraseForm {onsubmit} bind:data bind:errors />
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
