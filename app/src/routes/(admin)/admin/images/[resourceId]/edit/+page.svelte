<script lang="ts">
    import {AdminResultEditView, AdminEditImageForm} from "$client/components"
    import { page } from "$app/state"
    import api from "$shared/api"

    const resource = "images"
    const resourceId = page.params.resourceId
    const naturalKey = "title"
    const resourceApi = api.admin.images as ResourceApi

    const tabs = $state({
        default: {
            FormComponent: AdminEditImageForm,
            onsubmit: ({data}) => api.admin.images.resourceId$(resourceId).PUT({body: data}),
        }
    })
</script>

<AdminResultEditView
    {resourceApi}
    {resource}
    {tabs}
    {naturalKey}
/>