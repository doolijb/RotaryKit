<script lang="ts">
	import { ValidationBadges } from "$client/components"
	import { v4 } from "uuid"
	import type { AutocompleteOption } from "@skeletonlabs/skeleton-svelte"
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
		ref = $bindable(),
		disabled = $bindable(false),		
		isTouched = $bindable(false),

		// Events
		onchange,
		onblur,
		onfocus,
	}: Props = $props();

	////
	// CONSTANTS
	////

	const formCtx = form.getContext()

	////
	// STATE
	////

	let validatorLength = $state(0)

	////
	// FUNCTIONS
	////

	async function touch() {
		isTouched = true
	}

	function handleOnBlur(e: Event) {
		touch()
		onblur?.(e)
	}

	function handleOnChange(e: Event) {
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

</script>

<div class="mb-2">
	<div class="flex items-center">
		<label class="label-text inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} {form} {field}  />
		{/if} 
	</div>

	<select
		{id}
		class="select disabled:cursor-not-allowed"
		bind:this={ref}
		{placeholder}
		bind:value={formCtx.data[field]}
		{disabled}
		{required}
		{onfocus}
		onchange={handleOnChange}
		onblur={handleOnBlur}
		aria-label={label}
	>
		{#if !required}
			<option value="" selected={!formCtx.data[field]}>Select an option</option>
		{/if}
		{#if options && options.length > 0}
			{#each options.reverse() as option}
				<option value={option.value} selected={option===formCtx.data[field]}>{option.label}</option>
			{/each}
		{:else if selectOptionsValidator}
			{#each selectOptionsValidator.args["options"].reverse() as option}
				<option value={option} selected={option==formCtx.data[field]}>{option}</option>
			{/each}
		{/if}
	</select>
</div>
