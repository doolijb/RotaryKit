<script>
	import { SiteFooter, SiteNavigation } from "$client/components"
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">

    <header>
        <SiteNavigation />
    </header>

    <main class="flex-grow flex justify-center pt-5 px-2 mx-auto">
        {@render children?.()}
    </main>

    <footer>
        <SiteFooter />
    </footer>
    
</div>
