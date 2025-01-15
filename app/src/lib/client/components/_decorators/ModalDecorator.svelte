<script lang="ts">
    /**
     * Defines a user detail modal view
     */
    import {Modal} from "@skeletonlabs/skeleton-svelte"
    import {onMount} from "svelte"
    import Icon from "@iconify/svelte"

    interface Props {
        registry?: Record<string, any>;
        settings?: ModalSettings;
    }

    let { registry = null, settings = null }: Props = $props();

    function showModal() {
        // TODO
    }

    onMount(() => {
        showModal()
    })
</script>

<button class="btn preset-filled" onclick={showModal}>
    <Icon icon="mdi:alert" class="mr-2 h-6 w-6" />
    Show Modal
</button>
