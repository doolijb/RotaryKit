<script lang="ts">
	import byteSize from "byte-size"
    import {AdminResultsTableView} from "$client/components"
	import api from "$shared/api"

    const resource = "images"
    const resourceApi = api.admin.images as ResourceApi
    const orderedKeys = ["id", "status", "totalBytes", "uploadedByUser", "profileImageUser", "createdAt", "updatedAt"]
    const dataHandlers = {
        "totalBytes": {
            handler: (result: number) => byteSize(result).toString(),
            header: "Total size"
        },
        "uploadedByUser": {
            handler: (result: SelectUser | undefined) => result ? result.username : undefined
        },
        "profileImageUser": {
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