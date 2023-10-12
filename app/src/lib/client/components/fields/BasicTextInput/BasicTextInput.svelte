<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "@components"
    import {ValidStates} from "@constants"
    import {onMount} from "svelte"
    import type {IFieldValidator, IFieldErrors} from "@interfaces"
    import type {PopupSettings} from "@skeletonlabs/skeleton"
    import { v4 } from "uuid"

    //
    // Props
    //
    /** If the field is disabled */
    export let disabled = false
    /** List of validators with errors */
    export let fieldErrors: IFieldErrors = {}
    /** Field name */
    export let label = "Field Label"
    /** Placeholder text */
    export let placeholder = ""
    /** Reference to the input element */
    export let ref: HTMLInputElement
    /** Type of the input element */
    export let type = "text"
    /** List of validators */
    export let fieldValidator: IFieldValidator
    /** Field value */
    export let value = ""
    /** Field Id */
    export let id = v4()
    /** Touched state */
    export let isTouched = false

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
    $: required = !!fieldValidator.validators.required
    $: validState = isTouched
        ? Object.keys(fieldErrors).length
            ? ValidStates.INVALID
            : value 
                ? ValidStates.VALID 
                : ValidStates.NONE
        : ValidStates.NONE

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
            bind:value
            bind:this={ref}
            placeholder={!disabled ? placeholder : ""}
            {disabled}
            on:input={e => {
                validate()
                onInput(e)
            }}
            on:focus={onFocus}
            on:blur={e => {
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
</div>

<style lang="postcss">
    .input:focus-visible {
        outline: none;
        border: none;
    }
</style>
