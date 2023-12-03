<script lang="ts">
    import {AdminResultsTableView} from "@components"
    import { page } from "$app/stores"

    const resource = "users"
    const resourceTitle = "Users"
    const orderedKeys = ["id","username","emails","verifiedAt","isAdmin","isSuperUser"]
    const dataHandlers = {
        "emails": {
            header: "Primary Email",
            handler: (results: SelectEmail[]) => results !== undefined && results.length ? results[0].address : undefined 
        }
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceTitle}
    {orderedKeys}
    {dataHandlers}
/>