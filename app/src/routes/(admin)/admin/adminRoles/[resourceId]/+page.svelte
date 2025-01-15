<script lang="ts">
    import {AdminResultDetailView} from "$client/components"
    import { page } from "$app/state"
    import api from "$shared/api"

    const resource = "adminRoles"
    const resourceApi = api.admin.adminRoles as ResourceApi
    const dataHandlers = {}

    const mutateResult = (result: SelectAdminPermission & { 
        toAdminPermissions: {adminPermission: SelectAdminPermission}[]
        toUsers: {user: SelectUser}[]
    }) => {   
        const newResult = {
            ...result,
            adminPermissions: result.toAdminPermissions.map((toAdminPermission) => toAdminPermission.adminPermission),
            users: result.toUsers.map((toUser) => toUser.user)
        }
        delete newResult.toAdminPermissions
        delete newResult.toUsers
        return newResult
    }

    const naturalKey = "name"
    const resourceId = page.params.resourceId
</script>

<AdminResultDetailView
    {resource}
    {resourceApi}
    {dataHandlers}
    {naturalKey}
    {resourceId}
    {mutateResult}
/>
