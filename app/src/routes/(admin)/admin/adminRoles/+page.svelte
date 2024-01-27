<script lang="ts">
	import api from "$api"
    import {AdminResultsTableView} from "$components"

    const resource = "adminRoles"
    const resourceApi = api.admin.adminRoles as unknown as ResourceApi
    const orderedKeys = ["id","name","createdAt","updatedAt"]
    const dataHandlers = {
        toAdminPermissions: {
            header: "Permissions",
            handler: (result) => result ? result.length : 0,
        },
        toUsers: {
            header: "Users",
            handler: (result) => result ? result.length : 0,
        }
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceApi}
    {orderedKeys}
    {dataHandlers}
/>