<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"

	const dispatch = createEventDispatcher()

	////
	// PARENT EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement = undefined
	export let placeholder = attrs?.placeholder
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
	$: validatorLength = 0
	$: {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	}
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="mb-2">
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} {fieldErrors} />
		{/if}
	</div>

	<div class="input-group flex">
		{#if $$slots.prefix}
			<div class="align-middle m-0 px-0">
				<slot name="prefix" />
			</div>
		{/if}
		<input
			{id}
			class="input border-0 disabled:cursor-not-allowed"
			use:setType
			bind:this={ref}
			{placeholder}
			bind:value={data[field]}
			{disabled}
			{required}
			on:input={handleOnInput}
			on:focus={handleOnFocus}
			on:blur={handleOnBlur}
			aria-label={label}
		/>
		{#if $$slots.suffix}
			<div class="align-middle m-0 px-0 me-2">
				<slot name="suffix" />
			</div>
		{/if}
		{#if !disabled && validatorLength}
			<div class="legendIcon align-middle px-0 me-3">
				<ValidationLegend.Icon {fieldValidator} {fieldErrors} {validState} {legendPopup} />
			</div>
		{/if}
	</div>
	{#if !disabled && (validatorLength || attrs?.description)}
		<ValidationLegend.Popup {fieldValidator} {fieldErrors} {legendPopup} {attrs} />
	{/if}
</div>

<style lang="postcss">
	/* .input:focus-visible {
		outline: none;
		border: none;
	} */

	.input-group div.px-0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
</style>
