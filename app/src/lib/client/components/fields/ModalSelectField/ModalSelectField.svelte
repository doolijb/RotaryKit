<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"
	import ModalSelectFieldModal from "./ModalSelectFieldModal.svelte"
	import type { Snippet } from "svelte"
	import humanizeString from "humanize-string"
	

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string
		form: FormSchema
		id?: string
		result?: any
		placeholder?: string
		label?: string

		// Bindings
		data: FormDataOf<any>
		errors: FormErrors
		mapOptions: (data: any[]) => AutocompleteOption[]
		getOptions: ({searchString}) => Promise<any[]>
		disabled: boolean

		// Events
		onblur?: (e: Event) => void
		oninput?: (e: Event) => void

		// Children
		prefixSnippet?: Snippet
		suffixSnippet?: Snippet
	}

	let {
		// Props
		field,
		form,
		id = v4(),
		result,
		placeholder,
		label,

		// Bindings
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		mapOptions,
		getOptions,
		disabled = $bindable(false),		

		// Events
		onblur,
		oninput,

		// Children
		prefixSnippet,
		suffixSnippet,
	}: Props = $props();

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()

	////
	// STATE
	////

	let selectedOption = $state(undefined)
	let validatorLength = $state(0)
	let isTouched = $state(false)
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
		await validate()
	}

	let isModalOpen = $state(false)
	async function openModal() {
		isModalOpen = true
	}

	async function onModalConfirm(data) {
		selectedOption = data.selectedOption
		data[field] = selectedOption !== undefined ? selectedOption.value : undefined
		isModalOpen = false
		touch()
	}

	async function onModalClose() {
		isModalOpen = false
	}

	async function clearSelection() {
		data[field] = undefined
		selectedOption = undefined
		await touch()
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

	let attrs: FormFieldAttributes | undefined = $derived(form.fieldAttributes[field])
	let fieldValidator = $derived(form.fields[field])
	let validState = $derived(isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE)
	let displayValue = $derived(selectedOption ? selectedOption.label || selectedOption : "")

	$effect.pre(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	})

	$effect.pre(() => {
		if (!label) {
			if (attrs?.label) {
				label = attrs.label
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
		if (getOptions === undefined) {
			throw new Error("getOptions function is required")
		}
		if (mapOptions === undefined) {
			throw new Error("mapOptions function is required")
		}
		if (result) {
			selectedOption = mapOptions([result])[0];
			data[field] = selectedOption.value || selectedOption
		}
		data[field] && touch()
	})

</script>

<ModalSelectFieldModal
	bind:open={isModalOpen}
	{mapOptions}
	{getOptions}
	{selectedOption}
	title={label}
	body=""
	onConfirm={onModalConfirm}
	onClose={onModalClose}
	buttonTextSubmit="Submit"
	buttonTextCancel="Cancel"
	searchTimeout={undefined}
/>


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

    <div class="flex items-center">
		<button class="input-group flex cursor-pointer text-left px-1" title="Select" onclick={openModal} type="button">
			{#if prefixSnippet}
				<div class="align-middle m-0 px-0">
					{@render prefixSnippet()}
				</div>
			{/if}
			<span class="m-2 border-0 disabled:cursor-not-allowed flex-grow" class:text-surface-400={!data[field] || disabled} aria-label={label}>
				{displayValue || placeholder || "\u00A0"}
			</span>
			{#if suffixSnippet}
				<div class="align-middle m-0 px-0 me-2">
					{@render suffixSnippet()}
				</div>
			{/if}
			{#if !disabled && validatorLength}
				<div class="legendIcon align-middle px-0 me-3">
					<ValidationLegend.Icon {fieldValidator} bind:fieldErrors {validState} {legendPopup} />
				</div>
			{/if}
		</button>
		<div class="flex">
			<button type="button" class="btn preset-filled-secondary ml-2" onclick={openModal} disabled={disabled}>
				Select
			</button>
			<button type="button" class="btn preset-filled-surface ml-2" onclick={clearSelection} disabled={!data[field] || disabled}>
				Clear
			</button>
		</div>
    </div>
    {#if !disabled && (validatorLength || attrs?.description)}
        <ValidationLegend.Popup {fieldValidator} bind:fieldErrors {legendPopup} {attrs} />
    {/if}
</div>

<style lang="postcss">
	.input-group div.px-0 {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
</style>
