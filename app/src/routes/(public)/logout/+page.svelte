<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation"
	import { Loading } from "$client/components"
    import { toaster } from "$client/utils"
	import { getContext, onMount } from "svelte"


    onMount(async () => {
        await invalidateAll()
        toaster.create({description: "You are logged out", type: "success"})
        await goto("/")
    })

</script>

<Loading/>