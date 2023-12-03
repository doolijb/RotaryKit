<script lang="ts">
    import {AdminResultsTableView} from "@components"
    import { page } from "$app/stores"

    const resource = "emails"
    const resourceTitle = "Emails"
    const orderedKeys = ["id","address", "user", "isUserPrimary", "verifiedAt"]
    const dataHandlers = {
        "user": {
            handler: (result: SelectUser) => result !== undefined ? result.username : undefined
        },
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceTitle}
    {orderedKeys}
    {dataHandlers}
/>