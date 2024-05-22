<script lang="ts">
   	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"

	const dispatch = createEventDispatcher()

	////
	// UPSTREAM EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement = null
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let type: string = "text"
	export let id: string = v4()
	export let isTouched = false

	////
	// CALCULATED
	////

	$: fieldValidator = form.fields[field]
	$: fieldErrors = errors[field] || {}
	$: validatorLength = form.fields[field].validators.length
	$: required = fieldValidator.isRequired
	$: validState = isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()

	////
	// FUNCTIONS
	////

	function setType(node: HTMLInputElement) {
		// Can not set dynamic type directly in the input element
		node.type = type
	}

	async function validate() {
		errors[field] = await form.fields[field].validate({key:field, data})
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
		dispatch("blur", e)
	}

	function handleOnFocus(e: Event) {
		dispatch("focus", e)
	}

	function handleOnInput(e: Event) {
        data[field] = !data[field]
		touch()
		dispatch("input", e)
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
            type="checkbox"
            bind:this={ref}
            checked={!!data[field]}
            on:input={handleOnInput}
			on:focus={handleOnFocus}
			on:blur={handleOnBlur}
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
            <ValidationBadges {fieldValidator} {fieldErrors} hideRequired={true} />
        {/if}
    </div>
</div>

<style lang="postcss">
    .input:focus-visible {
        outline: none;
        border: none;
    }
</style>
