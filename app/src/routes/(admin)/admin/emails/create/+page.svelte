<script lang="ts">
    import {AdminCreateView, AdminCreateEmailForm} from "$client/components"
    import { page } from "$app/stores"
	import api from "$shared/api"
	import { onMount } from "svelte"

    const resource = "emails"
    const FormComponent = AdminCreateEmailForm
    const resourceApi = api.admin.emails as  ResourceApi
    const displayTitle = "Email"

    async function getUserChoices(e: string = "") {
        e ? console.log(e) : null
        api.admin.users.GET().Success((res) => { extras.userChoices = res.body })
    }

    let extras = {
        canEditSuperUsers: $page.data.user.isSuperUser,
        userChoices: {} as PaginatedResponse<Partial<SelectUser>>,
        getUserChoices: getUserChoices
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