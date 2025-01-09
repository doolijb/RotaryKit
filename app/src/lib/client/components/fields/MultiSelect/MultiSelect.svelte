<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import Icon from "@iconify/svelte"
	import humanizeString from "humanize-string"

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string
		form: FormSchema
		options: MultiSelectOption[]
		label?: string
		disabled?: boolean
		id?: string
		size?: number

		// Bindables
		data?: FormDataOf<any>
		errors?: Record<string, Record<string, string>>
		ref?: HTMLSelectElement
		isTouched?: boolean
		selectedValues?: string[]
		selectedAvailable?: string[]

		// Events
		onblur?: (e: Event) => void
		onfocus?: (e: Event) => void
		oninput?: (e: Event) => void
	}

	let {
		// Props
		field,
		form,
		options,
		label,
		disabled = $bindable(false),		id = v4(),
		size = 4,

		// Bindables
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		ref = $bindable(undefined),
		isTouched = $bindable(false),
		selectedValues = $bindable([]),
		selectedAvailable = $bindable([]),

		// Events
		onblur,
		onfocus,
		oninput
	}: Props = $props();

	////
	// STATE
	////

	let fieldErrors: FieldErrors = $state({})

	////
	// FUNCTIONS
	////

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

	function handleAdd() {

		data[field] = [... new Set([...Object.values(data[field]), ...selectedAvailable])]
		selectedAvailable = []
		touch()
	}

	function handleRemove() {
		data[field] = Object.values(data[field]).filter( value => !selectedValues.includes(value))
		selectedValues = []
		touch()
	}

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
		touch()
		onblur?.(e)
	}

	function handleOnInput(e: Event) {
		touch()
		oninput?.(e)
	}

	////
	// CALCULATED
	////

	let attrs = $derived(form.fieldAttributes[field])
	let fieldValidator = $derived(form.fields[field])
	let required = $derived(fieldValidator.isRequired)
	let canRemove = $derived(!!selectedValues.length) 
	let canAdd = $derived(!!selectedAvailable.length)

	$effect.pre(() => {
		if (data[field] === undefined) {
			data[field] = []
		}
		if (data[field].length) touch()
	})

	$effect.pre(() => {
		if (!label) {
			if (attrs.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect(() => {
		fieldErrors = errors[field] || {}
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
			<ValidationBadges {fieldValidator} bind:fieldErrors hideRequired={true} />
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
					onclick={handleAdd}
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
					onclick={handleRemove}
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
				oninput={handleOnInput}
				onblur={handleOnBlur}
				{onfocus}
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
