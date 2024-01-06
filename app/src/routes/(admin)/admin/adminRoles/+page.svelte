<script lang="ts">
    import {AdminResultsTableView} from "$components"

    const resource = "adminRoles"
    const displayTitle = "Admin Roles"
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
    {displayTitle}
    {orderedKeys}
    {dataHandlers}
/>