<script lang="ts">
	import "../app.postcss"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
	import { storePopup, initializeStores, Modal, Toast } from "@skeletonlabs/skeleton"
	import { ImageViewerModal, UserLoginModal, CreationUploadModal, SiteNavigation, SiteFooter, AdminModerateCreationModal } from "$client/components"
	import type { ModalComponent } from "@skeletonlabs/skeleton"
	import { page } from "$app/stores"


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
	const modalRegistry: Record<string, ModalComponent> = {
		imageViewerModal: { ref: ImageViewerModal },
	}

	////
	// LIFECYCLE
	////

	initializeStores()
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

</script>

<svelte:head>
	{#if $page.data.title}
		<title>{$page.data.title} - {siteName}</title>
	{:else}
		<title>{siteName}</title>
	{/if}
</svelte:head>

<div class="flex flex-col min-h-screen relative">
    <header>
        <SiteNavigation />
    </header>

<Toast />
<Modal components={modalRegistry} />
