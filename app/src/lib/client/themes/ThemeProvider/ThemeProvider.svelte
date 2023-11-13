<script lang="ts">
    import "../../../../app.postcss"
    import {
        arrow,
        autoUpdate,
        computePosition,
        flip,
        offset,
        shift,
        hide,
    } from "@floating-ui/dom"
    import {storePopup} from "@skeletonlabs/skeleton"
    import {SvelteComponent, onMount} from "svelte"

    export let darkMode = false
    /**
     * This is a component that imports the Skeleton theme and styles.
     * It's recommended to choose a theme from themeMap and pass the value into
     * the ThemeProvider theme prop.
     */
    export let theme = "skeleton"

    let Theme = null

    async function getTheme(theme: string) {
        await import("@themes").then(module => {
            Theme = module[theme]
        })
    }

    storePopup.set({computePosition, autoUpdate, offset, hide, shift, flip, arrow})

    onMount(async () => {
        await getTheme(theme)
    })

    $: theme ? getTheme(theme) : null
</script>

<svelte:component this={Theme} {theme} dark={darkMode}>
    <slot slot="body" />
</svelte:component>

<style lang="postcss">
    /* Expand full width and height */
    :global(html),
    :global(body),
    :global(#svelte) {
        @apply w-full h-full;
    }
</style>