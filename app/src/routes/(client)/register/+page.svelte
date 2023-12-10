<script lang="ts">
	import { Main, UserRegisterForm } from "@components"
	import { page } from "$app/stores"
	import axios from "axios"

	async function handleSubmit() {
		const response = await axios.post("/api/register", formData)
		if (response.status === 200) {
			completed = true
		}
	}

	let completed = false
	let formData = {
		email: "",
		passphrase: "",
		passphraseConfirm: ""
	}
	let formErrors = {
		email: {},
		passphrase: {},
		passphraseConfirm: {}
	}
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
					<UserRegisterForm on:submit={handleSubmit} bind:formData bind:formErrors />
				{:else}
					<div class="flex flex-col items-center justify-center space-y-4">
						<h1 class="text-2xl font-bold">Thank you for registering!</h1>
						<p class="text-lg">
							A confirmation link will be sent to <u>{formData.email || "your email"}</u>.
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
