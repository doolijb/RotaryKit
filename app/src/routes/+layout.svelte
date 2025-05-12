<script lang="ts">
	import "../app.css"
	import { Toaster } from "@skeletonlabs/skeleton-svelte"
	import { SiteNavigation, SiteFooter } from "$client/components"
	import { page } from "$app/state"
	import { toaster } from "$client/utils"


	////
	// PROPS
	////

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	////
	// CONSTANTS
	////
	const siteName = "Rotary Kit"

</script>

<svelte:head>
	{#if page.data.title}
		<title>{page.data.title} - {siteName}</title>
	{:else}
		<title>{siteName}</title>
	{/if}
</svelte:head>

<Toaster {toaster}></Toaster>

<div class="flex flex-col min-h-screen relative">
	<header>
		<SiteNavigation />
	</header>

	<div class="flex flex-col flex-grow">
		{@render children?.()}
	</div>

	<footer class="mt-auto">
		<SiteFooter />
	</footer>
</div>
