<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import type { Snippet } from 'svelte'
	import humanizeString from "humanize-string"

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string;
		placeholder?: string;
		label?: string;
		autocomplete?: string;

		// Bindables
		form?: FormSchema;
		data?: Record<string, any>;
		errors?: Record<string, any>;
		ref?: any;
		type?: string;
		disabled?: boolean;
		id?: string;
		isTouched?: boolean;

		// Events
		oninput?: (e: Event) => Promise<void> | void
		onfocus?: (e: Event) => Promise<void> | void
		onblur?: (e: Event) => Promise<void> | void

		// Snippets
		prefixSnippet?: Snippet
		suffixSnippet?: Snippet
	}

	let {
		// Props
		field,
		placeholder = "",
		label,

		// Bindables
		form = $bindable(),
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		ref = $bindable(undefined),
		type = $bindable("text"),
		disabled = $bindable(false),
		id = $bindable(v4()),
		isTouched = $bindable(false),

		// Events
		oninput,
		onfocus,
		onblur,

		// Snippets
		prefixSnippet,
		suffixSnippet,
	}: Props = $props();

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
		await validate()
	}

	async function handleOnBlur(e: Event) {
		await touch()
		await onblur?.(e)
	}

	async function handleOnInput(e: Event) {
		await touch()
		await oninput?.(e)
	}

	////
	// CALCULATED
	////

	let fieldValidator = $derived(form.fields[field])
	let fieldErrors = $derived(errors[field] || {})
	let validatorLength = $state(0);
	let attrs: FormFieldAttributes | undefined = $derived(form ? form.fieldAttributes[field] : {})

	$effect(() => {
		if (!placeholder && attrs) {
			placeholder = attrs.placeholder
		}
	})

	$effect(() => {
		if (!label) {
			if (attrs && attrs.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect(() => {
		if (!!ref) {
			ref.type = type
		}
	})
	
	$effect(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	});
	let required = $derived(fieldValidator.isRequired)
	let validState = $derived(isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE)

	////
	// LIFECYCLE
	////

	onMount(() => {
		data[field] && touch()
	})

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
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
		{#if prefixSnippet}
			<div class="align-middle m-0 px-0">
				{@render prefixSnippet?.()}
			</div>
		{/if}
		<input
			bind:this={ref}
			{id}
			{type}
			class="input border-0 disabled:cursor-not-allowed"
			{placeholder}
			bind:value={data[field]}
			{disabled}
			{required}
			{onfocus}
			oninput={handleOnInput}
			onblur={handleOnBlur}
			aria-label={label}
		/>
		{#if suffixSnippet}
			<div class="align-middle m-0 px-0 me-2">
				{@render suffixSnippet?.()}
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
	.input-group div.px-0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
</style>
