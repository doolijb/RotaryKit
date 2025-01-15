<script lang="ts">
	import { Modal } from "@skeletonlabs/skeleton-svelte"
	import type { Snippet } from "svelte"

	// Props

	interface Props {
		/** Exposes parent props to this component. */
		openState: boolean
		onCancel: (data?: unknown) => (void | Promise<void>)
        onConfirm: (data?: unknown) => (void | Promise<void>)
        title: string | Snippet<[unknown?]>
        body: string | Snippet<[unknown?]>
        data?: unknown
        cancelButton?: string | Snippet<[unknown?]>
        confirmButton?: string | Snippet<[unknown?]>
	}

	let { 
        openState = $bindable(), 
        onCancel,
        onConfirm,
        title = "Confirmation",
        body,
        data,
        cancelButton = "Cancel",
        confirmButton = "Confirm"
    }: Props = $props()

</script>

<Modal
	bind:open={openState}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			{#if typeof title !== "string"}
                {@render title(data)}
            {:else}
			    <h2 class="h2">{title}</h2>
            {/if}
		</header>
		<article>
            {#if typeof body !== "string"}
                {@render body(data)}
            {:else}
                <p class="opacity-60">
                    {body}
                </p>
            {/if}
		</article>
		<footer class="flex justify-end gap-4">
            {#if typeof cancelButton !== "string"}
                {@render cancelButton(data)}
            {:else}
                <button type="button" class="btn preset-tonal" onclick={onCancel}>{cancelButton}</button>
            {/if}
            {#if typeof confirmButton !== "string"}
                {@render confirmButton(data)}
            {:else}
                <button type="button" class="btn preset-filled" onclick={onConfirm}>{confirmButton}</button>
            {/if}
		</footer>
	{/snippet}
</Modal>
