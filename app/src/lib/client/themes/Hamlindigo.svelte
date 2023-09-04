<script lang="ts">
    import { Modal, Toast } from "@skeletonlabs/skeleton"
    

    interface Props {
        /**
     * This is a component that imports the hamlindigo theme and styles.
     */
        dark?: boolean;
        theme?: string;
        body?: import('svelte').Snippet;
    }

    let { dark = false, theme = "", body }: Props = $props();
</script>

<div data-theme={theme} class:dark>
    <Toast />
    <Modal />
    {@render body?.()}
</div>

<style lang="postcss">
    /* :not(.dark) {
        @apply bg-primary-100 text-primary-800;
    }

    .dark {
        @apply bg-primary-100 text-primary-900;
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
