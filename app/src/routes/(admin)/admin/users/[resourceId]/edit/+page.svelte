<script lang="ts">
    import {AdminEditResultView, AdminEditUserForm} from "@components"
    import { page } from "$app/stores"
    import axios from "axios"
	import AdminEditAdminRolesToUserForm from "$lib/client/components/forms/AdminEditAdminRolesToUserForm/AdminEditAdminRolesToUserForm.svelte"

    const resource = "users"
    const resourceId = $page.params.resourceId
    const naturalKey = "username"

    const tabs: AdminEditResultViewTabs = {
        default: {
            Form: AdminEditUserForm,
            handleSubmit: async (data) => {
                return await axios.put(`/api/admin/${resource}/${resourceId}`, data)
            }
        },
        adminRoles: {
            Form: AdminEditAdminRolesToUserForm,
            handleSubmit: async (data) => {
                return await axios.put(`/api/admin/${resource}/${resourceId}/adminRoles`, data)
            },
            getFormExtras: async () => {
                return {
                    adminRoles: (await axios.get("/api/admin/adminRoles?pageLimit=1000")).data.results
                }
            }
        },
    }
</script>

<AdminEditResultView
    {resource}
    {resourceId}
    {tabs}
    {naturalKey}
/>