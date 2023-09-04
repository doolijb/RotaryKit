<script lang="ts">
	import { Main, UserRegisterForm } from "$client/components"
	import { page } from "$app/stores"
	import { invalidateAll } from "$app/navigation"
	import { Toast, handleClientError, handleException, handleServerError } from "$client/utils"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import api from "$shared/api"

	const toastStore = getToastStore()

	async function onsubmit() {
		await api.register.POST({body: data})
			.Success(async (res) => {
				completed = true
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: "Your account has been created", style: "success" })
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

	let completed = $state(false)
	let data: UserRegisterForm["Data"] = $state({})
	let errors: FormErrors = $state({})

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
					<UserRegisterForm on:submit={onsubmit} bind:data bind:errors />
				{:else}
					<div class="flex flex-col items-center justify-center space-y-4">
						<h1 class="text-2xl font-bold">Thank you for registering!</h1>
						<p class="text-lg">
							A confirmation link will be sent to <u>{data.email || "your email"}</u>.
						</p>
					</div>
				{/if}
			</container>
		</div>
		<div class="card p-4">
			<p class="text-center">
				Already have an account?
				<a href="/login" class="btn btn-sm variant-filled-secondary">Login</a>
			</p>
		</div>
	</div>
</Main>
