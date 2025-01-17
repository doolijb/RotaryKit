<script lang="ts">
	import { Modal } from "@skeletonlabs/skeleton-svelte"
	import type { triggerAsyncId } from "async_hooks"
	import type { Snippet } from "svelte"

	// Props

	interface Props {
        onConfirm: (data?: unknown) => (void | Promise<void>)
        title: string | Snippet<[unknown?]>
        body: string | Snippet<[unknown?]>
        data?: unknown
        cancelButton?: string | Snippet<[unknown?]>
        confirmButton?: string | Snippet<[unknown?]>
        confirmButtonPreset?: string
        cancelButtonPreset?: string
        trigger?: Snippet<[unknown?]>
	}

	let { 
        onConfirm,
        title = "Confirmation",
        body,
        data,
        cancelButton = "Cancel",
        confirmButton = "Confirm",
        confirmButtonPreset = "preset-filled",
        cancelButtonPreset = "preset-tonal",
        trigger
    }: Props = $props()

    ////
    // STATE
    ////

    let open = $state(false)

    ////
    // FUNCTIONS
    ////

    function handleCancel() {
        open = false
    }

</script>

<Modal
	bind:open
	contentBase="card bg-surface-50-950 p-4 space-y-4 shadow-xl max-w-screen-sm shadow-xl"
	backdropClasses="backdrop-blur-sm"
    {trigger}
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
		<footer class="flex justify-end gap-4 mt-2">
            {#if typeof cancelButton !== "string"}
                {@render cancelButton(data)}
            {:else}
                <button type="button" class="btn {cancelButtonPreset}" onclick={handleCancel}>{cancelButton}</button>
            {/if}
            {#if typeof confirmButton !== "string"}
                {@render confirmButton(data)}
            {:else}
                <button type="button" class="btn {confirmButtonPreset}" onclick={onConfirm}>{confirmButton}</button>
            {/if}
		</footer>
	{/snippet}
</Modal>
