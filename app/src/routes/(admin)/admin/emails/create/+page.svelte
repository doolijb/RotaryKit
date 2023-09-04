<script lang="ts">
    import {AdminCreateView, AdminCreateEmailForm} from "$client/components"
    import { page } from "$app/stores"
	import api from "$shared/api"
	import { onMount } from "svelte"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton"

    const resource = "emails"
    const FormComponent = AdminCreateEmailForm
    const resourceApi = api.admin.emails as  ResourceApi
    const displayTitle = "Email"

    async function getUserOptions(args: {searchString: string}): Promise<any[]> {
        let results = []
        await api.admin.users.GET({query: { search: args.searchString }}).Success((res) => {results = res.body.results})
        return results
    }

    function mapUserOptions(data: any[]): AutocompleteOption[] {
        return data.map((user) => {
            return {
                value: user.id,
                label: user.username,
            }
        })
    }

    let extras = $state({
        canEditSuperUsers: $page.data.user.isSuperUser,
        getUserOptions,
        mapUserOptions,
    })

</script>

<AdminCreateView
    {resource}
    {resourceApi}
    {displayTitle}
    {FormComponent}
    {extras}
/>