<script lang="ts">
	import "../app.postcss"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
	import { storePopup, initializeStores, Modal, Toast } from "@skeletonlabs/skeleton"
	import {ImageViewerModal} from "$client/components"
	import type { ModalComponent } from "@skeletonlabs/skeleton"
	import { page } from "$app/stores"

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	initializeStores()
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const modalRegistry: Record<string, ModalComponent> = {
		imageViewerModal: { ref: ImageViewerModal },
	}

	const siteName = "SvelteKit Template"
</script>

<svelte:head>
	{#if $page.data.title}
	<title>{$page.data.title} - {siteName}</title>
	{:else}
	<title>{siteName}</title>
	{/if}
</svelte:head>

{@render children?.()}

<Toast />
<Modal components={modalRegistry} />
