<script lang="ts">
	import { ValidStates } from "$shared/constants"
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
		defaultValues?: Partial<typeof form["Data"]>
		disabled?: boolean

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
		defaultValues,
		disabled = $bindable(false),

		// Events
		onsubmit,
		oncancel,

		// Children
		children,
		extraButtonsSnippet,
		submitSnippet,
		cancelSnippet
	}: Props = $props()

	const formCtx = form.getContext()

	////
	// COMPUTED
	////

	$effect(() => {
		if (disabled !== undefined) {
			formCtx.meta.disabled = disabled
		}
	})

	$effect(() => {
		formCtx.meta.canSubmit = !Object.keys(formCtx.errors).length
	})

	$effect(() => {
		form.validate({ data: formCtx.data }).then((errors) => {
			formCtx.errors = errors
		})
		.then(() => {
			Object.keys(form.fields).forEach((key) => {
			formCtx.validStates[key] = formCtx.touchedFields[key]
				? formCtx.errors[key] && Object.keys(formCtx.errors).length
					? ValidStates.INVALID
					: formCtx.data[key]
						? ValidStates.VALID
						: ValidStates.NONE
				: ValidStates.NONE
		})
		})
	})

	$effect(() => {
		let doValidation = false

		Object.keys(formCtx.touchedFields).forEach((key) => {
				if (formCtx.touchedFields[key] !== formCtx.touchedFields[key]) {
					doValidation = true
				}
			})

		if (doValidation) {
			form.validate({ data: formCtx.data }).then((errors) => {
				formCtx.errors = errors
			})
		}
	})

	////
	// FUNCTIONS
	////

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
					formCtx.data[field] === undefined 
					|| formCtx.data[field] === null 
					|| formCtx.data[field] === ""
				)
			) {
				formCtx.data[field] = fieldAttrs[field].defaultValue
			}
		})
		if (defaultValues) {
			formCtx.data = {...formCtx.data, ...defaultValues }
		}
	})

</script>

{#if formCtx}
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
						<button type="button" class="btn variant-filled-surface" disabled={formCtx.meta?.disabled} onclick={oncancel}>
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
							disabled={formCtx.meta?.disabled || !formCtx.meta?.canSubmit}
							onclick={async (e) => {
								formCtx.meta.disabled = true
								formCtx.meta?.canSubmit && onsubmit && (await onsubmit(e))
								formCtx.meta.disabled = false
							}}
							title={formCtx.meta?.canSubmit ? "" : "Please fill out all required fields"}
						>
							{submitLabel}
						</button>
					</span>
				{/if}
			{/if}		
		</div>
	</div>
{/if}
<br/>