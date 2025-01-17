<script lang="ts">
	import api from "$shared/api"
    import { Loading } from "$client/components"
    import { onMount } from "svelte"
    import { goto } from "$app/navigation"
	import { Check, ExternalLink, X } from "lucide-svelte"
    

    ////
    // STATE
    ////

    let loading = $state(true)
    let users: (SelectUser & { emails: SelectEmail[] })[] = $state([])

    ////
    // FUNCTIONS
    ////

    function onclick(user: SelectUser & { emails: string[] }) {
        goto(`/admin/users/${user.id}`)
    }

    ////
    // LIFECYCLE
    ////

    onMount(async () => {
        api.admin.dashboard.newUsers.GET({}).Ok(({ body }) => {
            users = body.results
            loading = false
        })
    })
    

</script>
<div class="flex-grow max-h-full min-h-full bg-transparent">
    <h4 class="h4 mb-2">New Users</h4>
    
    {#if loading}
        <Loading />
    {:else}
        <div class="table-container">
            <table class="table-hover table text-inherit">
                <thead>
                    <tr>
                        <th>Created</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Verified</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        {@const createdDate = new Date(user.createdAt)}
                        {@const isVerified = !!user.verifiedAt}
                        <tr class="cursor-pointer" onclick={() => onclick(user)} title="View {user.username}">
                            <td>{createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}</td>
                            <td>{user.username}</td>
                            <td>{user.emails.length ? user.emails[0].address : ""}</td>
                            <td class="text-center">
                                {#if isVerified}
                                    <Check class="text-success-500" />
                                {:else}
                                    <X class="text-success-500" />
                                {/if}
                            </td>
                            <td>
                                <a href={`/admin/users/${user.id}`} target="_blank" class="btn btn-sm preset-filled" onclick={(e) => e.stopPropagation()}>
                                    <ExternalLink />
                                    Details
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
