<script lang="ts">
    import {AdminResultsTableView} from "$client/components"
	import api from "$shared/api"

    const resource = "users"
    const resourceApi = api.admin.users as ResourceApi
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
    {resourceApi}
    {orderedKeys}
    {dataHandlers}
/>