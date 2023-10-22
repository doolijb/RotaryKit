<!--
    Some documentation on how to use this component
 -->
<script lang="ts">
    import { ValidationBadges, ValidationLegend } from "@components"
    import { ValidStates } from "@constants"
    import { Autocomplete, popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import { v4 } from "uuid"
    import { onMount } from "svelte"
    import type { AutocompleteOption } from "@skeletonlabs/skeleton"
    

    //
    // Props
    //
    /** If the field is disabled */
    export let disabled = false
    /** List of validators with errors */
    export let fieldErrors: FieldErrors = {}
    /** Field name */
    export let label = "Field Label"
    /** Placeholder text */
    export let placeholder = ""
    /** Reference to the input element */
    export let ref: HTMLInputElement
    /** Type of the input element */
    export let type = "text"
    /** List of validators */
    export let fieldValidator: FieldValidator
    /** Field value */
    export let value = ""
    /** Field Id */
    export let id = v4()
    /** Touched state */
    export let isTouched = false

    export let options: AutocompleteOption[] = []
    export let searchInput = ""

    //
    // Events
    //
    /** Additional blur event handler */
    export let onBlur: (e: Event) => void | undefined
    /** Additional focus event handler */
    export let onFocus: (e: Event) => void | undefined
    /** Additional input event handler */
    export let onInput: (e: Event) => void | undefined

    //
    // Variables
    //
    $: validatorLength = Object.keys(fieldValidator.validators).length
    // On search input, we need to update the selected option
    $: selectedOption = null
    $: required = !!fieldValidator.validators.required
    $: isTouched = false
    $: validState = isTouched
        ? Object.keys(fieldErrors).length
            ? ValidStates.INVALID
            : value 
                ? ValidStates.VALID 
                : ValidStates.NONE
        : ValidStates.NONE
    
    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: v4(),
        placement: "bottom"
    }

    //
    // Constants
    //
    const legendPopup: PopupSettings = ValidationLegend.popupSettingsSettings()

    //
    // Functions
    //
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

    function updateField() {
        selectedOption = getOptionByLabel(searchInput) || null
        // Update the value
        if (selectedOption) {
            value = selectedOption.value
            searchInput = selectedOption.label
        } else {
            value = null
            searchInput = ""
        }
        isTouched = true
        validate()
    }

    function showOptions() {
        popup(ref, popupSettings)
    }

    // Helpers

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

    // Event handlers

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

    //
    // Lifecycle
    //
    onMount(async () => {
        if (value) {
            isTouched = true
            await validate()
        }
    })
</script>

<div>
    <div>
        <label class="label inline-flex mb-1" for={id}>
            <span 
                class="cursor-pointer select-none" 
                class:text-gray-500={disabled}
            >
                {label}
            </span>
        </label>
        {#if !disabled}
            <ValidationBadges {fieldValidator} {fieldErrors} />
        {/if}
    </div>

    <div class="input-group flex">
        <slot name="prefix" />
        <input
            {id}
            class="input border-0 ms-3 my-1 disabled:cursor-not-allowed"
            use:setType
            use:popup={popupSettings}
            bind:value={searchInput}
            bind:this={ref}
            placeholder={!disabled ? placeholder : ""}
            {disabled}
            on:input={e => {
                validate()
                onInput(e)
            }}
            on:focus={onFocus}
            on:blur={e => {
                updateField()
                validate()
                onBlur(e)
            }}
            aria-label={label}
            {required}
        />
        <slot name="suffix" />
        {#if !disabled && validatorLength}
            <ValidationLegend.Icon
                {fieldValidator}
                {fieldErrors}
                {validState}
                {legendPopup}
            />
        {/if}
    </div>
    {#if !disabled && validatorLength}
        <ValidationLegend.Popup {fieldValidator} {fieldErrors} {validState} {legendPopup} />
    {/if}
    <div 
        class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" 
        tabindex="-1"
        data-popup={popupSettings.target}
        >
        <Autocomplete bind:input={searchInput} {options} on:selection={handleSelection} />
        {#if searchInput}
            <div class="text-center">
                <button
                    class="mt-3 select-none"
                    on:click={e => {
                        value = ""
                        searchInput = ""
                        validate()
                        e.preventDefault()
                    }}
                >
                    Clear
                </button>
            </div>
        {/if}
    </div>
    <!-- <div  class="card z-10 p-3 shadow-xl max-h-[75vh] overflow-y-scroll flex">
        <span class="h3 mb-3 select-none"> Choose an option </span>
        <Autocomplete
            bind:input={searchInput}
            {options}
            on:selection={handleSelection}
        />
        Show a button to clear the value
        {#if searchInput}
            <div class="text-center">
                <button
                    class="btn-link btn variant-filled-secondary mt-3 select-none"
                    on:click={e => {
                        value = ""
                        searchInput = ""
                        validate()
                        e.preventDefault()
                    }}
                >
                    Reset
                </button>
            </div>
        {/if}
    </div> -->
</div>
    
<style lang="postcss">
    .input:focus-visible {
        outline: none;
        border: none;
    }
</style>
