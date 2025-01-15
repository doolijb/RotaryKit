<script lang="ts">
	import type { SvelteComponent } from "svelte"
    import { Modal } from "@skeletonlabs/skeleton-svelte"
	import { ImageView } from "$client/components"

	// Props
	
    interface Props {
        /** Exposes parent props to this component. */
        openState: boolean
        onClose: () => void
        result: SelectImage,
        size?: "small" | "original" | "medium" | "large"
    }

    let { 
        openState = $bindable(), 
        onClose,
        result,
        size
    }: Props = $props();

	const cButton = 'fixed top-4 right-4 z-50 font-bold shadow-xl transition-opacity duration-300 opacity-0';
	const cImage = 'rounded-container-token overflow-hidden shadow-xl';

    let buttonVisible = $state(false);

    // Show the button after a short delay to allow the modal to open
    setTimeout(() => {
        buttonVisible = true;
    }, 150); // Adjust the delay as needed

</script>

<Modal
  bind:open={openState}
  contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
  backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <!-- Button -->
        <button class="btn-icon preset-filled {cButton} {buttonVisible ? 'opacity-100' : 'opacity-0'}" onclick={onClose}>×</button>
        <!-- Image -->
        <ImageView {result} class={cImage} size={size || "original"} />
    {/snippet}
</Modal>

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
