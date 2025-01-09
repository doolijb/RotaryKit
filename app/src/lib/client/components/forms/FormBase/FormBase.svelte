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

	const isPopulated = $derived(!!Object.values(data).find((value) => !!value))
	const hasErrors = $derived(Object.keys(errors).some((field) => Object.keys(errors[field]).length))

	$effect(()=> {
		canSubmit = !hasErrors
	})

	////
	// Event Handlers
	////

	async function validate() {
		errors = await form.validate({data})
	}

	////
	// USE DIRECTIVES
	////

	/**
	 * This directive will submit the form when the user presses enter
	 */
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

	/**
	 * This directive will autofocus the first input field in the form
	 */
	function autofocus(node: HTMLFormElement) {
		// // Get the first input field in the form
		// const firstField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =
		// 	node.querySelector('input, select, textarea [type="radio"], [type="checkbox"]')

		// // Focus on the first field when the action is mounted
		// if (firstField) {
		// 	firstField.focus()
		// }

		return {
			// No cleanup necessary
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
	
	<form use:submitOnEnter use:autofocus {onsubmit} class="mb-4">
		{@render children()}
	</form>

	<div class="flex flex-row justify-between">

		<!-- Cancel button, etc -->
		{#if cancelSnippet}
			{@render cancelSnippet()}
		{:else}
			{#if showCancel}
				<button type="button" class="btn variant-filled-surface" {disabled} onclick={oncancel}>
					{cancelLabel}
				</button>
			{/if}
		{/if}

		{@render extraButtonsSnippet?.()}

		<!-- Submit button -->
		{#if submitSnippet}
			{@render submitSnippet()}
		{:else}
			{#if showSubmit}
				<button
					type="button"
					class="btn variant-filled ms-auto"
					disabled={disabled || !canSubmit}
					onclick={async (e) => {
						disabled = true
						validate()
						canSubmit && onsubmit && (await onsubmit(e))
						disabled = false
					}}
					title={canSubmit ? "" : "Please fill out all required fields"}
				>
					{submitLabel}
				</button>
			{/if}
		{/if}

	</div>
</div>
