<script lang="ts">
    import {AdminEditResultView, AdminEditAdminRoleForm} from "$client/components"
    import { page } from "$app/stores"
	import api from "$shared/api"

    const resource = "adminRoles"
    const resourceApi = api.admin.adminRoles as unknown as ResourceApi
    const resourceId = $page.params.resourceId
    const naturalKey = "name"
    const tabs = $state({
        default: {
            FormComponent: AdminEditAdminRoleForm,
            getExtras: async () => ({
                adminPermissions: await getAdminPermissions(),
            }),
            onsubmit: ({data}) => api.admin.adminRoles.resourceId$(resourceId).PUT({body: data}),
        }
    })

    async function getAdminPermissions() {
        let adminPermissions
        await api.admin.adminPermissions.GET({query: {pageLimit:1000}})
            .Success((r) => {
                adminPermissions = r.body.results as SelectAdminPermission[]
            })
        return adminPermissions
    }

</script>

<AdminEditResultView
    {resource}
    {resourceApi}
    {resourceId}
    {naturalKey}
    {tabs}
/>