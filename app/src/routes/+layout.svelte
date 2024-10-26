<script lang="ts">
	import "../app.postcss"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
	import { storePopup, initializeStores, Modal, Toast } from "@skeletonlabs/skeleton"
	import {ImageViewerModal} from "$client/components"
	import type { ModalComponent } from "@skeletonlabs/skeleton"
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	initializeStores()
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const modalRegistry: Record<string, ModalComponent> = {
		imageViewerModal: { ref: ImageViewerModal },
	}
</script>

<svelte:head>
	<title> - SvelteKit Template</title>
</svelte:head>

<Toast />
<Modal components={modalRegistry} />

{@render children?.()}
