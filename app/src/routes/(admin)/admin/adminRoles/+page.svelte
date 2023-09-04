<script lang="ts">
	import api from "$shared/api"
    import {AdminResultsTableView} from "$client/components"

    const resource = "adminRoles"
    const resourceApi = api.admin.adminRoles as unknown as ResourceApi
    const orderedKeys = ["id","name","createdAt","updatedAt"]
    const dataHandlers = {
        toAdminPermissions: {
            header: "Permissions",
            handler: (result: SelectAdminRolesToPermissions[]) => result ? result.length : 0,
        },
        toUsers: {
            header: "Users",
            handler: (result: SelectUsersToAdminRoles[]) => result ? result.length : 0,
        }
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceApi}
    {orderedKeys}
    {dataHandlers}
/>