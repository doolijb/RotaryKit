<script lang="ts">

	import { page } from "$app/state"
	import { AdminHeader } from "$client/components"
	import Icon from "@iconify/svelte"

</script>

<AdminHeader>
	{#snippet title()}
        <Icon icon="mdi:help-circle" class="mr-2 mb-1 w-auto inline" />
        <span class="capitalize">
            Help
        </span>
	{/snippet}
</AdminHeader>

<div class="flex flex-col gap-4">
    <h1 class="h3 mb-2">
        Your Admin Permissions
    </h1>
    <div class="table-wrap preset-tonal rounded p-2">
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                    <th>Resource</th>
                </tr>
            </thead>
            <tbody>
                {#each page.data.adminPermissions as permission}
                    <tr>
                        <td>{permission.name}</td>
                        <td>{permission.action}</td>
                        <td>{permission.resource}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>