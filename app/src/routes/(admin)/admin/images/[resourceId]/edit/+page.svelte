<script lang="ts">
    import {AdminEditResultView, AdminEditImageForm} from "$client/components"
    import { page } from "$app/stores"
    import api from "$shared/api"

    const resource = "images"
    const resourceId = $page.params.resourceId
    const naturalKey = "title"
    const resourceApi = api.admin.images as ResourceApi

    const tabs = $state({
        default: {
            FormComponent: AdminEditImageForm,
            onsubmit: ({data}) => api.admin.images.resourceId$(resourceId).PUT({body: data}),
        }
    })
</script>

<AdminEditResultView
    {resourceApi}
    {resource}
    {tabs}
    {naturalKey}
/>