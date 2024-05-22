<script lang="ts">
    import { ValidationBadges, ValidationLegend } from "$client/components"
    import { ValidStates } from "$shared/constants"
    import { Autocomplete, popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import type { AutocompleteOption } from "@skeletonlabs/skeleton"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

	const dispatch = createEventDispatcher()

	////
	// UPSTREAM EXPORTS
	////

	export let field: string
	export let form: FormSchema
	export let data: typeof form["Data"]
	export let errors: FormErrors
	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]
    export let options: AutocompleteOption[]

	////
	// LOCAL EXPORTS
	////

	export let ref: HTMLInputElement
	export let placeholder = attrs?.placeholder
	export let label:string = attrs?.label
	export let disabled: boolean = false
	export let type: string = "text"
	export let id: string = v4()
	export let isTouched = false
    export let searchInput = ""

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
    $: selectedOption = Object.values(options).find(option => option.value === data[field]) || null

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()
    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: v4(),
        placement: "bottom"
    }

	////
	// FUNCTIONS
	////

	function setType(node: HTMLInputElement) {
		node.type = type
	}

	async function validate() {
		errors[field] = await form.fields[field].validate({key:field, data})
	}

	async function touch() {
		isTouched = true
		validate()
	}

    function updateField() {
        if (searchInput) {
            const option = getOptionByLabel(searchInput)
            if (option) {
                data[field] = option.value
                searchInput = option.label
            } else {
                data[field] = undefined
                searchInput = ""
            }
        } else if (selectedOption) {
            if (searchInput !== selectedOption.label) {
                searchInput = selectedOption.label
            }
        } else {
            data[field] = undefined
            searchInput = ""
        }
        isTouched = true
        validate()
    }

    function showOptions() {
        popup(ref, popupSettings)
    }

    function getOptionByLabel(label: string): AutocompleteOption {
        // Find the option by label so we can track state during input or selection
        const option = options.find(
            option =>
                option.label.toLocaleLowerCase() === label.toLocaleLowerCase()
        )
        return option
    }

    function getOptionByValue(value: any): AutocompleteOption {
        // Find the option by value so we can track state during input or selection
        const option = options.find(option => option.value === value)
        return option
    }

    function handleSelection(e: CustomEvent) {
        // When an option is selected, update the search input,
        // the value will be updated automatically by the reactive variables
        if (!e.detail) {
            searchInput = ""
        } else {
            searchInput = e.detail.label
        }
        updateField()
    }

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
        updateField()
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
		if (data[field]) {
            updateField() 
            touch()
        }
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
            use:popup={popupSettings}
            bind:value={searchInput}
            bind:this={ref}
            placeholder={!disabled ? placeholder : ""}
            {disabled}
            on:input={handleOnInput}
			on:focus={handleOnFocus}
			on:blur={handleOnBlur}
            aria-label={label}
            {required}
        />
        <slot name="suffix" />
        {#if !disabled && validatorLength}
			<div class="legendIcon align-middle px-0 me-3">
				<ValidationLegend.Icon {fieldValidator} {fieldErrors} {validState} {legendPopup} />
			</div>
		{/if}
    </div>
    {#if !disabled && (validatorLength || attrs?.description)}
		<ValidationLegend.Popup {fieldValidator} {fieldErrors} {legendPopup} {attrs} />
	{/if}
    <div 
        class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" 
        tabindex="-1"
        data-popup={popupSettings.target}
        >
        <Autocomplete input={searchInput} {options} on:selection={handleSelection} />
        {#if searchInput}
            <div class="text-center">
                <button
                    class="mt-3 select-none"
                    type="button"
                    on:click={e => {
                        data[field] = ""
                        searchInput = ""
                        touch()
                        e.preventDefault()
                    }}
                >
                    Clear
                </button>
            </div>
        {/if}
    </div>
</div>
    
<style lang="postcss">
    .input:focus-visible {
        outline: none;
        border: none;
    }
</style>
