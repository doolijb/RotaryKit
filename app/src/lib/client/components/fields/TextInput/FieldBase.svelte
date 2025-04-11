<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"
	import type { Snippet } from 'svelte'
	import humanizeString from "humanize-string"

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string
		placeholder?: string
		label?: string
		autocomplete?: string
		description?: string

		// Bindables
		form?: FormSchema
		ref?: any
		type?: string
		disabled?: boolean
		id?: string

		// Events
		oninput?: (e: Event) => Promise<void> | void
		onfocus?: (e: Event) => Promise<void> | void
		onblur?: (e: Event) => Promise<void> | void

		// Snippets
		prefixSnippet?: Snippet
		suffixSnippet?: Snippet

		children: Snippet<[Record<string, any>]>
	}

	let {
		// Props
		field,
		placeholder = "",
		label,
		description,

		// Bindables
		form = $bindable(),
		ref = $bindable(undefined),
		type = $bindable("text"),
		disabled = $bindable(false),
		id = $bindable(v4()),

		// Events
		oninput,
		onfocus,
		onblur,

		// Snippets
		children,

		// Rest
		...restProps
	}: Props = $props()

	////
	// CONSTANTS
	////

	const formCtx = form.getContext()

	////
	// STATE
	////
	let attrs = $state(form.fieldAttributes[field] || {})

	////
	// FUNCTIONS
	////

	async function touch() {
		formCtx.touchedFields[field] = true
	}

	async function handleOnBlur(e: Event) {
		await touch()
		await onblur?.(e)
	}

	async function handleOnInput(e: Event) {
		await touch()
		await oninput?.(e)
	}

	////
	// CALCULATED
	////

	let fieldValidator = $derived(form.fields[field])
	let validatorLength = $state(0)

	/**
	 * Set the attributes for the field.
	 */
	$effect(() => {
		if (placeholder) {
			attrs.placeholder = placeholder
		} else if (attrs.placeholder) {
			placeholder = attrs.placeholder
		}

		if (description) {
			attrs.description = description
		} else if (attrs.description) {
			description = attrs.description
		}

		if (label) {
			attrs.label = label
		} else if (attrs.label) {
			label = attrs.label
		} else {
			attrs.label = humanizeString(field)
		}

		if (type) {
			attrs.type = type
		} else if (attrs.type) {
			type = attrs.type
		}

		if (ref) {
			ref.type = attrs.type
		}
	})
	
	$effect(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	})

	let isDisabled = $derived(disabled || formCtx.meta.disabled)

	////
	// LIFECYCLE
	////

	onMount(() => {
		formCtx.data[field] && touch()
	})

</script>

<div class="mb-2 w-100" title={isDisabled ? "Disabled" : ""}>
    <div class="flex items-center mb-1">
        <label class="label inline-flex" for={id}>
            <span class="cursor-pointer select-none" class:text-gray-500={disabled}>
                {attrs.label}
            </span>
        </label>
        {#if !isDisabled && validatorLength}
            <ValidationBadges {fieldValidator} {form} {field} />
        {/if}
    </div>

	{#if attrs?.description}
		<p id="{id}-description" class="text-sm text-gray-500 mb-1 w-100">
			{attrs.description}
		</p>
	{/if}

    {@render children({
		...restProps, 
		id, 
		field, 
		form, 
		onblur: handleOnBlur, 
		onfocus, 
		oninput: handleOnInput, 
		ref, 
		disabled: isDisabled, 
		attrs,
		value: formCtx.data[field]}
	)}

</div>
