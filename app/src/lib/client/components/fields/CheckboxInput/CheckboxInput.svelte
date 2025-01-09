<script lang="ts">
   	import { ValidationBadges } from "$client/components"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"
	import humanizeString from "humanize-string"

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
		data: Record<string, any>
		errors: Record<string, any>
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
		data = $bindable({}),
		errors = $bindable({}),
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

	function setType(node: HTMLInputElement) {
		// Can not set dynamic type directly in the input element
		node.type = type
	}

	async function validate() {
		let fieldErrors = await form.fields[field].validate({key:field, data})
		if (Object.keys(fieldErrors).length) {
			errors[field] = fieldErrors
		} else {
			delete errors[field]
		}
	}

	async function touch() {
		isTouched = true
		validate()
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		touch()
		onblur?.()
	}

	function handleOnInput(e: Event) {
        data[field] = !data[field]
		touch()
		oninput?.(e)
	}

	////
	// LIFECYCLE
	////

	onMount(() => {
		data[field] && touch()
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
            checked={!!data[field]}
			{onfocus}
            oninput={handleOnInput}
			onblur={handleOnBlur}
            aria-label={label}
        />
        <label class="label inline-flex me-3 mb-2" for={id}>
            <span 
                class="cursor-pointer select-none" 
                class:text-gray-500={disabled}
            >
                {label}
            </span>
        </label>
        {#if !disabled}
            <ValidationBadges {fieldValidator} bind:fieldErrors hideRequired={true} />
        {/if}
    </div>
</div>
