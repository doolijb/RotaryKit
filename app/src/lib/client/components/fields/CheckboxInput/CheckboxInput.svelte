<script lang="ts">
   	import { ValidationBadges } from "$client/components"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"
	import humanizeString from "humanize-string"
	import { ValidStates } from "$shared/constants"

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string
		form: FormSchema
		label?: string
		type?: "checkbox" | "radio"

		// Bindables
		disabled: boolean
		ref?: HTMLInputElement | null
		id?: string
		isTouched?: boolean

		// Events
		onblur?: () => void
		onfocus?: () => void
		oninput?: (e: Event) => void
	}

	let {
		// Props
		field,
		form,
		label,
		type = "checkbox",

		// Bindables
		disabled = $bindable(false),
		ref = $bindable(null),
		id = $bindable(v4()),
		isTouched = $bindable(false),

		// Events
		onblur,
		onfocus,
		oninput,
	}: Props = $props();

	////
	// STATE
	////

	let fieldErrors: FieldErrors = $state({})
	let validState = $state(ValidStates.NONE)

	////
	// CALCULATED
	////

	const attrs: FormFieldAttributes | undefined = $derived(form.fieldAttributes[field])
	let fieldValidator = $derived(form.fields[field])
	let required = $derived(fieldValidator.isRequired)

	$effect(() => {
		if (!label) {
			if (attrs?.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	////
	// FUNCTIONS
	////

	async function touch() {
		isTouched = true
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		touch()
		onblur?.()
	}

	function handleOnInput(e: Event) {
        formCtx.data[field] = !formCtx.data[field]
		touch()
		oninput?.(e)
	}

	////
	// LIFECYCLE
	////

	onMount(() => {
		formCtx.data[field] && touch()
	})

</script>

<div class="mb-2">
    <div class="flex items-center">
        <input
            {id}
            {disabled}
            {required}
            class="checkbox me-3 mb-2" 
            {type}
            bind:this={ref}
            checked={!!formCtx.data[field]}
			{onfocus}
            oninput={handleOnInput}
			onblur={handleOnBlur}
            aria-label={label}
        />
        <label class="label-text inline-flex me-3 mb-2" for={id}>
            <span 
                class="cursor-pointer select-none" 
                class:text-gray-500={disabled}
            >
                {label}
            </span>
        </label>
        {#if !disabled}
            <ValidationBadges {fieldValidator} bind:fieldErrors hideRequired={true} bind:validState />
        {/if}
    </div>
</div>
