<script lang="ts">
    import {AdminCreateView, AdminCreateEmailForm} from "$client/components"
    import { page } from "$app/stores"
	import api from "$shared/api"
	import { on } from "events"
	import { onMount } from "svelte"

    const resource = "users"
    const FormComponent = AdminCreateEmailForm
    const resourceApi = api.admin.users as  ResourceApi
    const displayTitle = "User"
    let extras = {
        canEditSuperUsers: $page.data.user.isSuperUser,
        userChoices: {} as PaginatedResponse<Partial<SelectUser>>,
    }

    async function getUserChoices() {
        api.admin.users.GET().Success((res) => { extras.userChoices = res.body })
    }

    onMount(() => {
        getUserChoices()
    })
</script>

<AdminCreateView
    {resource}
    {resourceApi}
    {displayTitle}
    {FormComponent}
    bind:extras
/>