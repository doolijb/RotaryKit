<script lang="ts">
    import type { IValidator } from "@interfaces"
    import { ValidStates } from "@constants"
    import type { PopupSettings } from "@skeletonlabs/skeleton/index"
    import { ValidationBadges, ValidationLegend } from "@components"
    import { onMount } from "svelte"


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
    export let ref: HTMLTextAreaElement
    /** Enable resize on the X axis */
    export let resizeX = false
    /** Enable resize on the Y axis */
    export let resizeY = false
    /** Number of rows to render */
    export let rows: number = 3
    /** Type of the input element */
    export let type = "text"
    /** List of validators */
    export let validators: IValidator[] = []
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

    //
    // Variables
    //
    $: required = false
    $: isTouched = false
    $: validState = isTouched
        ? errors.length === 0
            ? ValidStates.VALID
            : ValidStates.INVALID
        : ValidStates.NONE

    //
    // Constants
    //
     const legendPopup: PopupSettings = ValidationLegend.popupSettingsSettings()

    //
    // Functions
    //
    function validate() {
        errors = validators.filter(validator => !validator.test(value))
        validState =
            errors.length === 0 ? ValidStates.VALID : ValidStates.INVALID
    }

    function setType(node: HTMLInputElement) {
        // Can not set dynamic type directly in the input element
        node.type = type
    }

    // 
    // Lifecycle
    //
    onMount(() => {
        if (value) {
            isTouched = true
            validate()
        }
        validators.forEach(validator => {
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
        {#if !disabled}
        <ValidationLegend.Icon
                {validators}
                {errors}
                {validState}
                {legendPopup}
            />
        {/if}
    </div>
    <div>
        <textarea
            class="textarea"
            class:resize-none={!resizeY && !resizeX}
            class:resize-y={resizeY}
            class:resize-x={resizeX}
            cols="30"
            bind:this={ref}
            {disabled}
            {required}
            {rows}
            {value}
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
        />
    </div>
    {#if !disabled}
        <ValidationLegend.Popup {validators} {errors} {validState} {legendPopup} />
    {/if}
</label>

<style lang="postcss">

</style>