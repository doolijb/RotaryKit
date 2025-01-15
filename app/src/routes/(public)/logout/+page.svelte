<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation"
	import { Loading } from "$client/components"
    import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import { getContext, onMount } from "svelte"

    const toast: ToastContext = getContext("toast")

    onMount(async () => {
        await invalidateAll()
        toast.create({description: "You are logged out", type: "success"})
        await goto("/")
    })

</script>

<Loading/>