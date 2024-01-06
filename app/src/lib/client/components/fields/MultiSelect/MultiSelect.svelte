<script lang="ts">
	import { ValidationBadges } from "$components"
	import { ValidStates } from "$constants"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import Icon from "@iconify/svelte"
	import type { Primitive } from "$validation/base"

	////
	// Props
	////

	/** If the field is disabled */
	export let disabled = false
	/** List of validators with errors */
	export let fieldErrors: FieldErrors = {}
	/** Field name */
	export let label = "Field Label"
	/** Reference to the input element */
	export let ref: HTMLSelectElement | undefined = undefined
	/** Type of the input element */
	export let type: string = "text"
	/** List of validators */
	export let fieldValidator: Primitive<unknown[]>
	/** Chosen options */
	export let value: unknown[] = []
	/** Field Id */
	export let id: string = v4()
	/** Touched state */
	export let isTouched = false
	/** The height of the field */
	export let size: number = 4
	/** The available key:title options that can be selected */
	export let options: { [key: string]: string | number, label: string }[] = []
	/** Actively selected values that can be removed */
	export let selectedValues = []
	/** The actively selected available options that can be added */
	export let selectedAvailable = []

	////
	// Events
	////

	/** Additional blur event handler */
	export let onBlur: (e: Event) => void | undefined = undefined
	/** Additional focus event handler */
	export let onFocus: (e: Event) => void | undefined = undefined
	/** Additional input event handler */
	export let onInput: (e: Event) => void | undefined = undefined

	////
	// Variables
	////

	$: required = !!fieldValidator.validators.required
	$: canRemove = !!selectedValues.length 
	$: canAdd = !!selectedAvailable.length

	////
	// Functions
	////

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

	////
	// Lifecycle
	////

	onMount(async () => {
		if (value) {
			isTouched = true
			await validate()
		}
	})

	function handleAdd() {
		// Add selected options in availableOptions to selectedOptions
		value = value.concat(selectedAvailable)
		selectedAvailable = []
		validate()
	}

	function handleRemove() {
		// Remove selected options in selectedOptions
		Object.values(selectedValues).forEach((option) => {
			value = value.filter((chosenOption) => chosenOption !== option)
		})
		validate()
	}

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
	<!-- Side by side select, with arrows to add, remove from left to right -->
	<div class="sm:flex sm:flex-col md:grid md:grid-cols-5 gap-4">
		<div class="flex flex-col col-span-2">
			<select class="select h-full" multiple bind:value={selectedAvailable} {size} {disabled}>
				{#each Object.values(options) as {key, label}}
					{#if !value.includes(key)}
						<option value={key}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm">
				Available options: {Object.keys(options).length - value.length}
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
			>
				{#each Object.values(options) as {key, label}}
					{#if value.includes(key)}
						<option value={key}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm">Selected options: {value.length}</span>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
