<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { ImageView } from '$client/components'

	// Props
	
    interface Props {
        /** Exposes parent props to this component. */
        parent: SvelteComponent;
    }

    let { parent }: Props = $props();

	const modalStore = getModalStore();

	const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl transition-opacity duration-300 opacity-0';
	const cImage = 'rounded-container-token overflow-hidden shadow-xl';
    console.log($modalStore[0]?.image)

    let buttonVisible = $state(false);

    // Show the button after a short delay to allow the modal to open
    setTimeout(() => {
        buttonVisible = true;
    }, 150); // Adjust the delay as needed
</script>

{#if $modalStore[0]}
	<!-- Button -->
    <button class="btn-icon variant-filled {cButton} {buttonVisible ? 'opacity-100' : 'opacity-0'}" onclick={parent.onClose}>×</button>
	<!-- Image -->
	<ImageView result={$modalStore[0].meta.result} class="{cImage}" size={$modalStore[0].meta.size} />
{/if}

<style>
    .transition-opacity {
        transition: opacity 0.3s ease-in-out;
    }
    .opacity-0 {
        opacity: 0;
    }
    .opacity-100 {
        opacity: 1;
    }
</style>