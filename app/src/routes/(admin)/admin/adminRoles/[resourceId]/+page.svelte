<script lang="ts">
    import {AdminResultDetailView} from "@components"
    import { page } from "$app/stores"

    const resource = "adminRoles"
    const displayTitle = "Admin Role"
    const dataHandlerSet = {}

    const mutateResult = (result) => {   
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
    const resourceId = $page.params.resourceId
</script>

<AdminResultDetailView
    {resource}
    {displayTitle}
    {dataHandlerSet}
    {naturalKey}
    {resourceId}
    {mutateResult}
/>