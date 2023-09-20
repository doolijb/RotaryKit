<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "@components"
    import {ValidStates} from "@constants"
    import {onMount} from "svelte"
    import type {IValidator, IValidatorSet} from "@interfaces"
    import type {PopupSettings} from "@skeletonlabs/skeleton"

    //
    // Props
    //
    /** If the field is disabled */
    export let disabled = false
    /** List of validators with errors */
    export let errors: IValidator[] = []
    /** Field name */
    export let label = "Field Label"
    /** Placeholder text */
    export let placeholder = ""
    /** Reference to the input element */
    export let ref: HTMLInputElement
    /** Type of the input element */
    export let type = "text"
    /** List of validators */
    export let validators: IValidatorSet = {}
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
        ? errors.length === 0
            ? ValidStates.VALID
            : ValidStates.INVALID
        : ValidStates.NONE

    /**
     * Constants
     */
    const legendPopup: PopupSettings = ValidationLegend.makePopupSettings()

    /**
     * Functions
     */
    function validate() {
        errors = Object(validators).values.filter((validator: IValidator) => !validator.test(value))
        validState =
            errors.length === 0 ? ValidStates.VALID : ValidStates.INVALID
    }

    function setType(node: HTMLInputElement) {
        // Can not set dynamic type directly in the input element
        node.type = type
    }

    /**
     * Lifecycle
     */
    onMount(() => {
        if (value) {
            isTouched = true
            validate()
        }
        Object(validators).values.forEach((validator: IValidator) => {
            switch (validator.key) {
            case "required":
                required = true
                break
            case "maxLength":
                ref.maxLength = validator.args["maxLen"]
                break
            case "minLength":
                ref.minLength = validator.args["minLen"]
                break
            }
        })
    })
</script>

<label class="label">
    <div>
        <span class="cursor-pointer select-none" class:text-gray-500={disabled}>
            {label}
        </span>
        {#if !disabled}
            <ValidationBadges {validators} {errors} />
        {/if}
    </div>

    <div
        class="input-group"
        class:grid-cols-[auto_1fr_auto]={$$slots.prefix && validators.length}
        class:grid-cols-[1fr_auto]={!$$slots.prefix && validators.length}
        class:grid-cols-[auto_1fr]={$$slots.prefix && !validators.length && !disabled}
        class:grid-cols-[1fr]={!$$slots.prefix && !validators.length && !disabled}
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
        {#if !disabled}
            <ValidationLegend.Icon
                {validators}
                {errors}
                {validState}
                {legendPopup}
            />
        {/if}
    </div>
    {#if !disabled}
        <ValidationLegend.Popup {validators} {errors} {validState} {legendPopup} />
    {/if}
</label>

<style lang="postcss">
</style>
