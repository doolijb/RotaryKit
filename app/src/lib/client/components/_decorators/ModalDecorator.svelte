<script lang="ts">
    /**
     * Defines a user detail modal view
     */
    import {Modal} from "@skeletonlabs/skeleton-svelte"
	import { AlertCircle } from "lucide-svelte"
    import {onMount} from "svelte"

    interface Props {
    }

    let { }: Props = $props();

    function showModal() {
        // TODO
    }

    onMount(() => {
        showModal()
    })
</script>

<button class="btn preset-filled" onclick={showModal}>
    <AlertCircle />
    Show Modal
</button>
