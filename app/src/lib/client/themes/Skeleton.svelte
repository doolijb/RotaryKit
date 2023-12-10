<script lang="ts">
	import { Modal, Toast } from "@skeletonlabs/skeleton"

    /**
     * This is a component that imports the skeleton theme and styles.
     */

    export let dark = false
    export let theme = "skeleton"

    console.log("theme", theme)

</script>

<div class="dark:text-gray-100" data-theme={theme} class:dark>
    <Toast />
    <Modal />
    <slot name="body" />
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
