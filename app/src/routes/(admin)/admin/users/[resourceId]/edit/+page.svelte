<script lang="ts">
    import {AdminEditResultView, AdminEditUserForm} from "$client/components"
    import { page } from "$app/stores"
    import axios from "axios"
	import AdminEditAdminRolesToUserForm from "$client/components/forms/AdminEditAdminRolesToUserForm/AdminEditAdminRolesToUserForm.svelte"
    import api from "$shared/api"
	import { hasAdminPermission } from "$client/utils"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { forms as f } from "$shared/validation"
    const toastStore = getToastStore()

    const resource = "users"
    const resourceId = $page.params.resourceId
    const naturalKey = "username"
    const resourceApi = api.admin.users as ResourceApi

    const tabs: AdminEditResultViewTabs = {
        default: {
            FormComponent: AdminEditUserForm,
            onSubmit: ({ data }: { data: FormDataOf<f.AdminEditUser> | FormDataOf<f.AdminEditUserWithPermissions> }) => {
                return api.admin.users.resourceId$(resourceId).PUT({body: data})
            }
        },
    }

    ////
    // TAB: ADMIN ROLES
    ////

    if (hasAdminPermission({
        user: $page.data.user,
        adminPermissions: $page.data.permissions,
        action: "PUT",
        resources: ["user", "admin_roles"],
    })) {
        tabs["adminRoles"] = {
            FormComponent: AdminEditAdminRolesToUserForm,
            onSubmit: ({ data }: { data: FormDataOf<f.AdminEditAdminRolesToUser>}) => {
                return api.admin.users.resourceId$(resourceId).adminRoles.PUT({body: data})
            },
            getExtras: async () => {
                let adminRoles
                await api.admin.adminRoles.GET({query: {pageLimit: 1000}}).Ok((res) => {
                        adminRoles = res.body.results
                    })
                return { adminRoles }
            }
        }
    }
</script>

<AdminEditResultView
    {resourceApi}
    {resource}
    {tabs}
    {naturalKey}
/>