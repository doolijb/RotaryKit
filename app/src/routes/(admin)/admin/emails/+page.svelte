<script lang="ts">
    import {AdminResultsTableView} from "$client/components"
    import { page } from "$app/state"
	import api from "$shared/api"

    const resource = "emails"
    const resourceApi = api.admin.emails as ResourceApi
    const orderedKeys = ["id","address", "user", "isUserPrimary", "verifiedAt"]
    const dataHandlers = {
        "user": {
            handler: (result: SelectUser | undefined) => result ? result.username : undefined
        },
    }
</script>

<AdminResultsTableView 
    {resource}
    {resourceApi}
    {orderedKeys}
    {dataHandlers}
/>