<script lang="ts">
    import { run } from 'svelte/legacy';

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


    
    interface Props {
        // })
        darkMode?: boolean;
        /**
     * This is a component that imports the Skeleton theme and styles.
     * It's recommended to choose a theme from themeMap and pass the value into
     * the ThemeProvider theme prop.
     */
        theme?: string;
        children?: import('svelte').Snippet;
    }

    let { darkMode = false, theme = "skeleton", children }: Props = $props();

    let Theme = $state(null)

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

    run(() => {
        theme ? getTheme(theme) : null
    });
</script>

<Theme {theme} dark={darkMode}>
    {#snippet body()}
        {@render children?.()}
    {/snippet}
</Theme>

<style lang="postcss">
    /* Expand full width and height */
    :global(html),
    :global(body),
    :global(#svelte) {
        @apply w-full h-full;
    }
</style>