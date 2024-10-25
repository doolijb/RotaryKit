<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings, AutocompleteOption } from "@skeletonlabs/skeleton"
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

	export let ref: HTMLSelectElement = undefined
	export let placeholder = attrs?.placeholder
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let id: string = v4()
	export let isTouched = false
	export let autocomplete: string = undefined
	export let options: AutocompleteOption[] = []

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
	$: selectOptionsValidator = fieldValidator.validators.find(v => v.key == "selectOptions")

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()

	////
	// FUNCTIONS
	////

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

	<select
		{id}
		class="select disabled:cursor-not-allowed"
		bind:this={ref}
		{placeholder}
		bind:value={data[field]}
		{disabled}
		{required}
		on:input={handleOnInput}
		on:focus={handleOnFocus}
		on:blur={handleOnBlur}
		aria-label={label}
		{autocomplete}
	>
		{#if !required}
			<option value="" selected={!data[field]}>Select an option</option>
		{/if}
		{#if options && options.length > 0}
			<options value="Test 3">Test!</options>
			{#each options.reverse() as option}
				<option value={option.value} selected={option===data[field]}>{option.label}</option>
			{/each}
		{:else if selectOptionsValidator}
			{#each selectOptionsValidator.args["options"].reverse() as option}
				<option value={option} selected={option==data[field]}>{option}</option>
			{/each}
		{/if}
	</select>
</div>

<style lang="postcss">
	.input-group div.px-0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
</style>
