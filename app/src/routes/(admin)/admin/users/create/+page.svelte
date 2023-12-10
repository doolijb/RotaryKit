<script lang="ts">
    import {AdminCreateView, AdminCreateUserForm} from "@components"
    import { page } from "$app/stores"

    const resource = "users"
    const displayTitle = "User"

    console.log($page.params.resourceId)
</script>

<AdminCreateView
    {resource}
    {displayTitle}
    Form={AdminCreateUserForm}
/>