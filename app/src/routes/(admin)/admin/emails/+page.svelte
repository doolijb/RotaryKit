<script lang="ts">
    import {AdminResultsTableView} from "$components"
    import { page } from "$app/stores"
	import api from "$api"

    const resource = "emails"
    const resourceApi = api.admin.emails as ResourceApi
    const orderedKeys = ["id","address", "user", "isUserPrimary", "verifiedAt"]
    const dataHandlers = {
        "user": {
            handler: (result: SelectUser) => result !== undefined ? result.username : undefined
        },
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceApi}
    {orderedKeys}
    {dataHandlers}
/>