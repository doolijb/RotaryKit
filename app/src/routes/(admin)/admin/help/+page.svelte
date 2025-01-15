<script lang="ts">

	import { page } from "$app/state"

</script>
<div class="card p-4 mb-5">
    <h1 class="h1">
        Help
    </h1>
</div>

<div class="card p-4 mb-5">
    <h3 class="h3">
        Your Admin Permissions
    </h3>
</div>
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