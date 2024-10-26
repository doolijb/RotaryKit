<script lang="ts">
	import { Modal, Toast } from "@skeletonlabs/skeleton"

    

    interface Props {
        /**
     * This is a component that imports the crimson theme and styles.
     */
        dark?: boolean;
        theme?: string;
        body?: import('svelte').Snippet;
    }

    let { dark = false, theme = "", body }: Props = $props();
</script>

<div class="dark:bg-gray-800" data-theme={theme} class:dark>
    <Toast />
    <Modal />
    {@render body?.()}
</div>

<style lang="postcss">
    /* :not(.dark) {
        @apply bg-primary-100 text-primary-800;
    } */

    /* .dark {
        @apply text-white-100;
    } */

    /* :not(.dark) :global(th) {
            @apply text-dark;
        }

    .dark :global(th) {
            @apply text-dark;
        } */

    .dark {
        @apply text-gray-300;
    }
</style>
