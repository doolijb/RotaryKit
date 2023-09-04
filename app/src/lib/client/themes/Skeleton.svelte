<script lang="ts">
	import { Modal, Toast } from "@skeletonlabs/skeleton"

    

    interface Props {
        /**
     * This is a component that imports the skeleton theme and styles.
     */
        dark?: boolean;
        theme?: string;
        body?: import('svelte').Snippet;
    }

    let { dark = false, theme = "skeleton", body }: Props = $props();

</script>

<div class="dark:text-gray-100" data-theme={theme} class:dark>
    <Toast />
    <Modal />
    {@render body?.()}
</div>

<style lang="postcss">
    /* :not(.dark) {
        @apply bg-primary-100 text-primary-800;
    } */

    /* :not(.dark) :global(th) {
            @apply text-dark;
        }

    .dark :global(th) {
            @apply text-dark;
        } */

    /* set text color in dark mode */
    .dark {
        @apply text-gray-300;
    }

    /*
     * Toast defaults
     */
    .alert-dialog {
        @apply bg-gray-800 text-gray-100;
    }
</style>
