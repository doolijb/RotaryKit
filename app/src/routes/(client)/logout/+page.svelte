<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation"
	import { Loading } from "$components"
    import { getToastStore } from "@skeletonlabs/skeleton"
    import { Toast } from "$utils"
	import { onMount } from "svelte"

    const toastStore = getToastStore()

    onMount(async () => {
        await invalidateAll()
        toastStore.trigger(new Toast({message: "You are logged out", style: "success"}))
        await goto("/")
    })

</script>

<Loading/>