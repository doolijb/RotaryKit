<script lang="ts">
    import {AdminCreateView, AdminCreateAdminRoleForm} from "$components"
    import { page } from "$app/stores"
    import axios from "axios"
	import { onMount } from "svelte"

    const resource = "adminRoles"
    const displayTitle = "Admin Role"
    const formExtras = {
        adminPermissions: [] as SelectAdminPermission[],
    }

    async function loadAdminPermissions() {
        const { data } = await axios.get("/api/admin/adminPermissions?pageLimit=1000").catch((error) => {
            console.log(error)
            return { data: { results: [] } }
        })
        formExtras.adminPermissions = data.results
    }

    onMount(async () => {
        await loadAdminPermissions()
    })
</script>

<AdminCreateView
    {resource}
    {displayTitle}
    Form={AdminCreateAdminRoleForm}
    {formExtras}
/>