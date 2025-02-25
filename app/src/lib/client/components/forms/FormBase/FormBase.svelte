<script lang="ts">
	import type { FormSchema } from "$shared/validation/base"
	import { onMount, type Snippet } from "svelte"

	////
	// EXPORTS
	////

	interface Props {
		// Props
		submitLabel?: string
		cancelLabel?: string
		showCancel?: boolean
		showSubmit?: boolean
		form: FormSchema
		useSubmitOnEnter?: boolean

		// Bindables
		disabled?: boolean
		data?: typeof form["Data"]
		errors?: FormErrors
		canSubmit?: boolean

		// Events
		onsubmit?: (args: any) => Promise<void>
		oncancel?: (args: any) => Promise<void>

		// Children
		children?: Snippet
		extraButtonsSnippet?: Snippet
		submitSnippet?: Snippet
		cancelSnippet?: Snippet
	}

	let {
		// Props
		submitLabel = "Submit",
		cancelLabel = "Cancel",
		showCancel = true,
		showSubmit = true,
		form,
		useSubmitOnEnter = false,

		// Bindables
		disabled = $bindable(false),
		data = $bindable({} as typeof form["Data"]),
		errors = $bindable({}),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel,

		// Children
		children,
		extraButtonsSnippet,
		submitSnippet,
		cancelSnippet
	}: Props = $props()

	////
	// COMPUTED
	////

	$effect(() => {
		validate(data)
	})

	$effect(() => {
		canSubmit = !Object.keys(errors).length
	})

	////
	// FUNCTIONS
	////

	async function validate(data:typeof form["Data"]) {
		errors = await form.validate({data})
	}

	function submitOnEnter(node: HTMLFormElement) {
		const handler = (event: KeyboardEvent) => {
			if (!useSubmitOnEnter) {
				return
			}
			if (event.key === "Enter") {
				onsubmit(event)
			}
		}

		// Get the last input, select, radio, or checkbox field in the form
		const lastField = Array.from(
			node.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
				'input, select, [type="radio"], [type="checkbox"]'
			)
		)
			.filter((field) => field.type !== "textarea")
			.pop()

		// Add the keydown event listener to the last field
		if (lastField) {
			lastField.addEventListener("keydown", handler)
		}

		return {
			destroy() {
				// Remove the event listener when the action is destroyed
				if (lastField) {
					lastField.removeEventListener("keydown", handler)
				}
			}
		}
	}

	////
	// LIFECYCLE
	////

	onMount(() => {
		const fieldAttrs = form.fieldAttributes
		Object.keys(fieldAttrs).forEach((field) => {
			if (
				"defaultValue" in fieldAttrs[field] && 
				(
					data[field] === undefined 
					|| data[field] === null 
					|| data[field] === ""
				)
			) {
				data[field] = fieldAttrs[field].defaultValue
			}
		})
	})

</script>

<div>
	
	<form use:submitOnEnter {onsubmit} class="mb-4">
		{@render children()}
	</form>

	<div class="flex gap-2 flex-row justify-between">

		<!-- Cancel button, etc -->
		{#if cancelSnippet}
			{@render cancelSnippet()}
		{:else}
			{#if showCancel}
				<span class="h-fit">
					<button type="button" class="btn variant-filled-surface" {disabled} onclick={oncancel}>
						{cancelLabel}
					</button>
				</span>
			{/if}
		{/if}

		{@render extraButtonsSnippet?.()}

		<!-- Submit button -->
		{#if submitSnippet}
			{@render submitSnippet()}
		{:else}
			{#if showSubmit}
				<span class="h-fit">
					<button
						type="button"
						class="btn variant-filled ms-auto"
						disabled={disabled || !canSubmit}
						onclick={async (e) => {
							disabled = true
							canSubmit && onsubmit && (await onsubmit(e))
							disabled = false
						}}
						title={canSubmit ? "" : "Please fill out all required fields"}
					>
						{submitLabel}
					</button>
				</span>
			{/if}
		{/if}		
	</div>
</div>
