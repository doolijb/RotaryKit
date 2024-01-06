<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$components"
	import { ValidStates } from "$constants"
	import { onMount } from "svelte"

	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import { v4 } from "uuid"

	//
	// Props
	//
	/** If the field is disabled */
	export let disabled = false
	/** List of validators with errors */
	export let fieldErrors: FieldErrors = {}
	/** Field name */
	export let label = "Field Label"
	/** Placeholder text */
	export let placeholder = ""
	/** Reference to the input element */
	export let ref: HTMLInputElement | undefined = undefined
	/** Type of the input element */
	export let type: string = "text"
	/** List of validators */
	export let fieldValidator: FieldValidator
	/** Field value */
	export let value: string = ""
	/** Field Id */
	export let id: string = v4()
	/** Touched state */
	export let isTouched = false

	//
	// Events
	//
	/** Additional blur event handler */
	export let onBlur: (e: Event) => void | undefined = undefined
	/** Additional focus event handler */
	export let onFocus: (e: Event) => void | undefined = undefined
	/** Additional input event handler */
	export let onInput: (e: Event) => void | undefined = undefined

	//
	// Variables
	//
	$: validatorLength = Object.keys(fieldValidator.validators).length
	$: required = !!fieldValidator.validators.required
	$: validState = isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: value
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE

	//
	// Constants
	//
	const legendPopup: PopupSettings = ValidationLegend.popupSettingsSettings()

	//
	// Functions
	//
	async function validate() {
		touch()
		fieldErrors = await fieldValidator.test(value)
	}

	function setType(node: HTMLInputElement) {
		// Can not set dynamic type directly in the input element
		node.type = type
	}

	function touch() {
		isTouched = true
	}

	//
	// Lifecycle
	//
	onMount(async () => {
		if (value) {
			isTouched = true
			await validate()
		}
	})

	// If fieldErrors is ever null, set it to an empty object to avoid exceptions
	$: fieldErrors == undefined ? (fieldErrors = {}) : null
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="mb-2">
	<div>
		<label class="label inline-flex mb-1" for={id}>
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
			bind:value
			bind:this={ref}
			placeholder={!disabled ? placeholder : ""}
			{disabled}
			on:input={(e) => {
				validate()
				onInput && onInput(e)
			}}
			on:focus={(e) => {
				onFocus && onFocus(e)
			}}
			on:blur={(e) => {
				validate()
				onblur && onBlur(e)
			}}
			aria-label={label}
			{required}
		/>
		{#if $$slots.suffix}
			<div class="align-middle m-0 px-0">
				<slot name="suffix" />
			</div>
		{/if}
		{#if !disabled && validatorLength}
			<div class="align-middle m-0 px-0">
				<ValidationLegend.Icon {fieldValidator} {fieldErrors} {validState} {legendPopup} />
			</div>
		{/if}
	</div>
	{#if !disabled && validatorLength}
		<ValidationLegend.Popup {fieldValidator} {fieldErrors} {validState} {legendPopup} />
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
