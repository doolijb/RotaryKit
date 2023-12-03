<script>
	import "../app.postcss"
	import { SiteFooter, SiteNavigation } from "@components"
	import { page } from "$app/stores"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
	import { storePopup, initializeStores } from "@skeletonlabs/skeleton"

	initializeStores()
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<svelte:head>
	<title>{$page.data.title} - SvelteKit Template</title>
</svelte:head>

User: {$page.data.user?.username}
<br />

<SiteNavigation />
<!-- Make main fixed width -->
<main class="container mx-auto flex-grow my-5 px-5">
	<slot />
</main>

<SiteFooter />
