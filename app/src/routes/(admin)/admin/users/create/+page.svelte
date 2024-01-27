<script lang="ts">
    import {AdminCreateView, AdminCreateUserForm} from "$components"
    import { page } from "$app/stores"
	import api from "$api"

    const resource = "users"
    const FormComponent = AdminCreateUserForm
    const resourceApi = api.admin.users as  ResourceApi
    const displayTitle = "User"
    const extras = {
        canEditSuperUsers: $page.data.user.isSuperUser,
    }

    console.log($page.params.resourceId)
</script>

<AdminCreateView
    {resource}
    {resourceApi}
    {displayTitle}
    {FormComponent}
    {extras}
/>