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
    import { initializeStores, storePopup } from "@skeletonlabs/skeleton"
    import { onMount } from "svelte"
	
    // import {vi} from "vitest"

//     vi.mock('$app/stores', async () => {
// 	const { readable, writable } = await import('svelte/store');
// 	/**
// 	 * @type {import('$app/stores').getStores}
// 	 */
// 	const getStores = () => ({
// 		navigating: readable(null),
// 		page: readable({ url: new URL('http://localhost'), params: {} }),
// 		session: writable(null),
// 		updated: readable(false)
// 	});
// 	/** @type {typeof import('$app/stores').page} */
// 	const page = {
// 		subscribe(fn) {
// 			return getStores().page.subscribe(fn);
// 		}
// 	};
// 	/** @type {typeof import('$app/stores').navigating} */
// 	const navigating = {
// 		subscribe(fn) {
// 			return getStores().navigating.subscribe(fn);
// 		}
// 	};
// 	/** @type {typeof import('$app/stores').session} */
// 	const session = {
// 		subscribe(fn) {
// 			return getStores().session.subscribe(fn);
// 		}
// 	};
// 	/** @type {typeof import('$app/stores').updated} */
// 	const updated = {
// 		subscribe(fn) {
// 			return getStores().updated.subscribe(fn);
// 		}
// 	};
// 	return {
// 		getStores,
// 		navigating,
// 		page,
// 		session,
// 		updated
// 	};
// })

    export let darkMode = false
    /**
     * This is a component that imports the Skeleton theme and styles.
     * It's recommended to choose a theme from themeMap and pass the value into
     * the ThemeProvider theme prop.
     */
    export let theme = "skeleton"

    let Theme = null

    async function getTheme(theme: string) {
        await import("$client/themes").then(module => {
            Theme = module[theme]
        })
    }

    initializeStores()
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