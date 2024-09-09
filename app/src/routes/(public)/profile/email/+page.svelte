<script lang="ts">
	import { page } from '$app/stores'
	import { Main } from '$client/components'
	import api from '$shared/api'
	import Icon from '@iconify/svelte'
	import { onMount } from 'svelte'
    import { AddEmailAddressForm } from '$client/components'
	import { handleClientError, handleException, handleServerError, Toast } from '$client/utils'
	import { invalidateAll } from '$app/navigation'
	import { getToastStore } from '@skeletonlabs/skeleton'

	const toastStore = getToastStore()

	async function onAddEmailSubmit() {
		await api.profile.email.POST({body: addEmailData})
			.Success(async (res) => {
                getEmails()
				addEmailCompleted = true
				await invalidateAll()
				toastStore.trigger(
					new Toast({ message: "Your email was added", style: "success" })
				)
			})
			.ClientError((r) => { 
                addEmailErrors = r.body.errors
                return handleClientError({ errors:addEmailErrors, toastStore})(r)
            })
			.ServerError(handleServerError({ toastStore }))
			.catch(handleException({ toastStore }))
	}

	let addEmailCompleted = false
	let addEmailData: AddEmailAddressForm["Data"]
	let addEmailErrors: FormErrors

    export let emails = [];

    async function getEmails() {
        api.profile.email.GET().Ok((res) => {
            emails = res.body.emails;
        })
    }

    onMount(async () => {
        getEmails()
    })
</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{$page.data.title}
			</h1>
		</div>
	</div>

    <div class="m-auto md:w-[35rem]">
        <table class="table table-hover w-full mb-4">
            <thead>
                <tr>
                    <th class="text-start">Email Address</th>
                    <th class="text-start">Verified At</th>
                    <th class="text-start">Is Primary</th>
                    <th class="text-start"></th>
                </tr>
            </thead>
            <tbody>
                {#each emails as email}
                    <tr>
                        <td>{email.address}</td>
                        <td>
                            {#if email.verifiedAt}
                                {new Date(email.verifiedAt).toLocaleDateString()}
                            {:else}
                                <button class="btn btn-primary">Resend Verification Email</button>
                            {/if}
                        </td>
                        <td>
                            {#if email.isUserPrimary}
                                <Icon icon="mdi:check" class="w-6 h-6 text-green-500" />
                            {:else if email.verifiedAt}
                                <button class="btn btn-secondary">Make Primary</button>
                            {/if}
                        </td>
                        <td>
                            {#if !email.isUserPrimary && emails.length > 1}
                                <button class="btn btn-secondary">Delete</button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="m-auto md:w-[35rem]">
        <div class="card p-4 mb-4 border-0 mb-4">
            <p> Your primary address is used for login and communications. </p>
            <p> Additional email addresses may be used for account recovery. </p>
        </div>
    </div>

    <div class="m-auto md:w-[35rem]">
        <div class="card p-4 mb-4 border-0">
            <h2 class="h3 mb-3">Add Email Address</h2>
            {#if addEmailCompleted}
                <div class="alert alert-success">
                    A verification email has been sent to your new email address. Please check your inbox and click the link to verify your email address.
                </div>
            {:else}
                <AddEmailAddressForm bind:data={addEmailData} bind:errors={addEmailErrors} on:submit={onAddEmailSubmit} />
            {/if}
        </div>
    </div>
    
</Main>