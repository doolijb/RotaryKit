<script lang="ts">
    import {AdminCreateView, AdminCreateAdminRoleForm} from "$client/components"
	import { onMount } from "svelte"
	import api from "$shared/api"

    const resource = "adminRoles"
    const resourceApi = api.admin.adminRoles as unknown as ResourceApi
    const displayTitle = "Admin Role"
    const FormComponent = AdminCreateAdminRoleForm
    const extras = {
        adminPermissions: [] as SelectAdminPermission[],
    }

    async function loadAdminPermissions() {
        api.admin.adminPermissions.GET({query: {pageLimit:1000}})
            .Success((r) => {
                extras.adminPermissions = r.body.results as SelectAdminPermission[]
            })
    }

    onMount(async () => {
        await loadAdminPermissions()
    })
</script>

<AdminCreateView
    {resource}
    {resourceApi}
    {displayTitle}
    {FormComponent}
    {extras}
/>