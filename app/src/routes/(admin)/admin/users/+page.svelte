<script lang="ts">
    import {AdminResultsTableView} from "@components"

    const resource = "users"
    const displayTitle = "Users"
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
    {displayTitle}
    {orderedKeys}
    {dataHandlers}
/>