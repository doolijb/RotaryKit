<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "@components"
    import {ValidStates} from "@constants"
    import {onMount} from "svelte"
    import type {IFieldValidator, IFieldErrors} from "@interfaces"
    import type {PopupSettings} from "@skeletonlabs/skeleton"

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

    //
    // Events
    //
    /** Additional blur event handler */
    export let onBlur: (e: Event) => void | undefined
    /** Additional focus event handler */
    export let onFocus: (e: Event) => void | undefined
    /** Additional input event handler */
    export let onInput: (e: Event) => void | undefined

    /**
     * Variables
     */
    $: required = false
    $: isTouched = false
    $: validState = isTouched
        ? Object.keys(fieldErrors)
            ? ValidStates.VALID
            : ValidStates.INVALID
        : ValidStates.NONE
    $: validatorLength = Object.keys(fieldValidator.validators).length

    /**
     * Constants
     */
    const legendPopup: PopupSettings = ValidationLegend.popupSettingsSettings()

    /**
     * Functions
     */
    async function validate() {
        fieldErrors = await fieldValidator.test(value)
        validState =
            Object.keys(fieldErrors) ? ValidStates.VALID : ValidStates.INVALID
    }

    function setType(node: HTMLInputElement) {
        // Can not set dynamic type directly in the input element
        node.type = type
    }

    /**
     * Lifecycle
     */
    onMount(async () => {
        if (value) {
            isTouched = true
            await validate()
        }
    })
</script>

<label class="label">
    <div>
        <span class="cursor-pointer select-none" class:text-gray-500={disabled}>
            {label}
        </span>
        {#if !disabled}
            <ValidationBadges {fieldValidator} {fieldErrors} />
        {/if}
    </div>

    <div
        class="input-group"
        class:grid-cols-[auto_1fr_auto]={$$slots.prefix && validatorLength}
        class:grid-cols-[1fr_auto]={!$$slots.prefix && validatorLength}
        class:grid-cols-[auto_1fr]={$$slots.prefix && !validatorLength && !disabled}
        class:grid-cols-[1fr]={!$$slots.prefix && !validatorLength && !disabled}
    >
        <slot name="prefix" />
        <input
            class="input border-s-0 disabled:cursor-not-allowed"
            use:setType
            bind:value
            bind:this={ref}
            placeholder={!disabled ? placeholder : ""}
            {disabled}
            on:input={e => {
                isTouched = true
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
        <!-- {#if !disabled}
            <ValidationLegend.Icon
                {fieldValidator}
                {fieldErrors}
                {validState}
                {legendPopup}
            />
        {/if} -->
    </div>
    {#if !disabled}
        <ValidationLegend.Popup {fieldValidator} {fieldErrors} {validState} {legendPopup} />
    {/if}
</label>

<style lang="postcss">
</style>
