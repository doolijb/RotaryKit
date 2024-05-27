<script lang="ts">
    import {AdminEditResultView, AdminEditEmailForm} from "$client/components"
    import { page } from "$app/stores"
    import api from "$shared/api"
	import { forms as f } from "$shared/validation"

    const resource = "emails"
    const resourceId = $page.params.resourceId
    const naturalKey = "address"
    const resourceApi = api.admin.emails as ResourceApi

    const tabs: AdminEditResultViewTabs = {
        default: {
            FormComponent: AdminEditEmailForm,
            onSubmit: ({ data }: { data: FormDataOf<f.AdminEditUser> | FormDataOf<f.AdminEditUserWithPermissions> }) => {
                return api.admin.emails.resourceId$(resourceId).PUT({body: data})
            }
        },
    }
</script>

<AdminEditResultView
    {resourceApi}
    {resource}
    {tabs}
    {naturalKey}
/>