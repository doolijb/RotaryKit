<script lang="ts">

import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import Icon from "@iconify/svelte"

	const dispatch = createEventDispatcher()

	////
	// UPSTREAM EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]
	export let options: MultiSelectOption[]
	interface MultiSelectOption { [key: string]: string | number, label: string }

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLSelectElement = undefined
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let id: string = v4()
	export let isTouched = false
	export let size: number = 4
	export let selectedValues = []
	export let selectedAvailable = []

	////
	// CALCULATED
	////

	$: fieldValidator = form.fields[field]
	$: fieldErrors = errors[field] || {}
	// $: validatorLength = form.fields[field].validators.length
	$: required = fieldValidator.isRequired
	// $: validState = isTouched
	// 	? fieldErrors && Object.keys(fieldErrors).length
	// 		? ValidStates.INVALID
	// 		: data[field]
	// 		  ? ValidStates.VALID
	// 		  : ValidStates.NONE
	// 	: ValidStates.NONE
	$: canRemove = !!selectedValues.length 
	$: canAdd = !!selectedAvailable.length

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

	function handleAdd() {
		data[field] = [... new Set([...Object.values(data[field]), ...selectedAvailable])]
		selectedAvailable = []
		touch()
	}

	function handleRemove() {
		console.log("selectedValues", selectedValues)
		data[field] = Object.values(data[field]).filter( value => !selectedValues.includes(value))
		selectedValues = []
		touch()
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
		if (data[field]) touch()
	})

</script>

<div class="mb-2">
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} {fieldErrors} hideRequired={true} />
		{/if}
	</div>
	<!-- Side by side select, with arrows to add, remove from left to right -->
	<div class="sm:flex sm:flex-col md:grid md:grid-cols-5 gap-4">
		<div class="flex flex-col col-span-2">
			<select class="select h-full" multiple bind:value={selectedAvailable} {size} {disabled}>
				{#each Object.values(options) as {key, label}}
					{#if !Object.values(data[field]).includes(key)}
						<option value={key}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm">
				Available options: {Object.keys(options).length - Object.values(data[field]).length}
				</span>
		</div>

		<div class="flex flex-col w-auto">
			<div class="flex flex-col items-center justify-center h-full">
				<button
					type="button"
					class="btn btn-primary btn-sm mb-2"
					on:click={handleAdd}
					disabled={!canAdd || disabled}
					title={canAdd ? "Add selected options" : "First select an option to add"}
				>
					<Icon icon="akar-icons:arrow-down" class="md:hidden w-4 h-4" />
					<span class="mx-2">
						Add
					</span>
					<Icon icon="akar-icons:arrow-right" class="hidden md:inline w-4 h-4" />
				</button>
				<button
					type="button"
					class="btn btn-primary btn-sm mb-3"
					on:click={handleRemove}
					disabled={!canRemove || disabled}
					title={canRemove ? "Remove selected options" : "First select an option to remove"}
				>
					<Icon icon="akar-icons:arrow-up" class="md:hidden w-4 h-4" />
					<Icon icon="akar-icons:arrow-left" class="hidden md:inline-block w-4 h-4" />
					<span class="mx-2">
						Remove
					</span>
				</button>
			</div>
		</div>

		<div class="flex flex-col col-span-2">
			<select
				{id}
				class="select h-full border-success-500"
				multiple
				bind:value={selectedValues}
				{size}
				bind:this={ref}
				{disabled}
				on:input={handleOnInput}
				on:focus={handleOnFocus}
				on:blur={handleOnBlur}
				aria-label={label}
				{required}
			>
				{#each Object.values(options) as {key, label}}
					{#if Object.values(data[field]).includes(key)}
						<option value={key}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm">Selected options: {Object.values(data[field]).length}</span>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
