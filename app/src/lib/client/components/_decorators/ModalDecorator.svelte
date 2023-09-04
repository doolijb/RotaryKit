<script lang="ts">
    /**
     * Defines a user detail modal view
     */
    import {Modal, getModalStore, type ModalSettings} from "@skeletonlabs/skeleton"
    import {onMount} from "svelte"
    import Icon from "@iconify/svelte"

    interface Props {
        registry?: Record<string, any>;
        settings?: ModalSettings;
    }

    let { registry = null, settings = null }: Props = $props();

    const modalStore = getModalStore()

    function showModal() {
        modalStore.trigger(settings)
    }

    onMount(() => {
        showModal()
    })
</script>

<button class="btn variant-filled" onclick={showModal}>
    <Icon icon="mdi:alert" class="mr-2 h-6 w-6" />
    Show Modal
</button>

<Modal components={registry} />
