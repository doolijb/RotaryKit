<script lang="ts">
    import { Toast, Modal } from "@skeletonlabs/skeleton"
    /**
     * This is a component that imports the rocket theme and styles.
     */
    // import "@skeletonlabs/skeleton/themes/theme-rocket.css"
    

    interface Props {
        // import "@skeletonlabs/skeleton/styles/all.css"
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
