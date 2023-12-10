<script lang="ts">
    import {AdminEditResultView, AdminEditAdminRoleForm} from "@components"
    import { page } from "$app/stores"
    import axios from "axios"

    const resource = "adminRoles"
    const resourceId = $page.params.resourceId
    const naturalKey = "name"
    const tabs = {
        default: {
            Form: AdminEditAdminRoleForm,
            getFormExtras: async () => ({
                adminPermissions: (await axios.get("/api/admin/adminPermissions")).data.results,
            }),
            handleSubmit: async (data: {[key:string]: any}) => (await axios.put(`/api/admin/${resource}/${resourceId}`, data)).data,
        }
    }

</script>

<AdminEditResultView
    {resource}
    {resourceId}
    {naturalKey}
    {tabs}
/>