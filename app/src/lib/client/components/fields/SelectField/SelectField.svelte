<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings, AutocompleteOption } from "@skeletonlabs/skeleton-svelte"
	import type { FormSchema } from "$shared/validation/base"
	import humanizeString from 'humanize-string'

	////
	// LOCAL EXPORTS
	////

	interface Props {
		// Props
		field: string
		form: FormSchema
		placeholder?: string
		label?: string
		id?: string
		options?: AutocompleteOption[]

		// Bindables
		data?: Record<string, any>
		errors?: Record<string, any>
		ref?: any
		disabled?: boolean
		isTouched?: boolean

		// Events
		onchange?: (e: Event) => Promise<void>
		onblur?: (e: Event) => Promise<void>
		onfocus?: (e: Event) => Promise<void>
	}

	let {
		// Props
		field,
		form,
		placeholder,
		label,
		id = v4(),
		options,

		// Bindables
		data = $bindable({}),
		errors = $bindable({}),
		ref = $bindable(),
		disabled = $bindable(false),		
		isTouched = $bindable(false),

		// Events
		onchange,
		onblur,
		onfocus,
	}: Props = $props();

	////
	// STATE
	////

	let validatorLength = $state(0)
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

	function handleOnBlur(e: Event) {
		touch()
		onblur?.(e)
	}

	function handleOnChange(e: Event) {
		console.log("handleOnChange")
		touch()
		onchange?.(e)
	}

	////
	// CALCULATED
	////

	let attrs = $derived(form.fieldAttributes[field])
	let fieldValidator = $derived(form.fields[field])
	let required = $derived(fieldValidator.isRequired)
	let selectOptionsValidator = $derived(fieldValidator.validators.find(v => v.key == "selectOptions"))

	$effect(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	})

	$effect.pre(() => {
		if (!label) {
			if (attrs && attrs.placeholder) {
				label = attrs.placeholder
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect(() => {
		fieldErrors = errors[field] || {}
	})

	////
	// LIFECYCLE
	////

	onMount(() => {
		data[field] && touch()
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
			<ValidationBadges {fieldValidator} bind:fieldErrors />
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
		{onfocus}
		onchange={handleOnChange}
		onblur={handleOnBlur}
		aria-label={label}
	>
		{#if !required}
			<option value="" selected={!data[field]}>Select an option</option>
		{/if}
		{#if options && options.length > 0}
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
