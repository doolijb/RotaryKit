<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { PopupSettings, AutocompleteOption, ModalSettings, ModalComponent, ModalStore } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ModalSelectFieldModal from './ModalSelectFieldModal.svelte'

	const dispatch = createEventDispatcher()
	const modalStore = getModalStore()

	////
	// PARENT EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]
	export let mapOptions: (data: any[]) => AutocompleteOption
    export let getOptions: ({searchString}) => Promise<any[]>
	export let result: any = undefined

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement = undefined
	export let placeholder = attrs?.placeholder
	export let label:string = attrs?.label
	export let disabled: boolean = false
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
	// $: required = fieldValidator.isRequired
	$: validState = isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE
	let selectedOption = undefined
	$: displayValue = selectedOption ? selectedOption.label || selectedOption : ""

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

	async function openModal() {
		const modalComponent: ModalComponent = {
			ref: ModalSelectFieldModal,
			props: {
				mapOptions,
				getOptions,
				selectedOption,
			},
		}
		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
			title: label,
			body: "",
			buttonTextSubmit: "Select",
			response: (response) => {
				console.log(response)
				if (!!response) {
					selectedOption = response.selectedOption
					data[field] = selectedOption !== undefined ? selectedOption.value : undefined
				}
				touch()
			},
		}
		modalStore.trigger(modal)
	}

	function clearSelection() {
		data[field] = undefined
		selectedOption = undefined
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

    <div class="flex items-center">
		<div class="input-group flex">
			{#if $$slots.prefix}
				<div class="align-middle m-0 px-0">
					<slot name="prefix" />
				</div>
			{/if}
			<span class="m-2 border-0 disabled:cursor-not-allowed flex-grow" class:text-surface-400={!data[field] || disabled} aria-label={label}>
				{displayValue || placeholder || "\u00A0"}
			</span>
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
		<div class="flex">
			<button type="button" class="btn variant-filled-secondary ml-2" on:click={openModal} disabled={disabled}>
				Select
			</button>
			<button type="button" class="btn variant-filled-surface ml-2" on:click={clearSelection} disabled={!data[field] || disabled}>
				Clear
			</button>
		</div>
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
