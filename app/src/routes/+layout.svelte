<script>
	import {SiteFooter, SiteNavigation} from "@components"
	import { page } from "$app/stores"
	import "../app.postcss"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<svelte:head>
	<title>{$page.data.title} - SvelteKit Template</title>
</svelte:head>

User: {$page.data.user?.username}
<br>

<SiteNavigation/>
<!-- Make main fixed width -->
<main class="container mx-auto my-5 px-5">
	<slot/>
</main>

<SiteFooter/>