<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "@components"
    import {ValidStates} from "@constants"
    import {onMount} from "svelte"
    
    import type {PopupSettings} from "@skeletonlabs/skeleton"
    import { v4 } from "uuid"

    //
    // Props
    //
    /** If the field is disabled */
    export let disabled = false
    /** List of validators with errors */
    export let fieldErrors: FieldErrors = {}
    /** Field name */
    export let label = "Field Label"
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
    export let fieldValidator: FieldValidator
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

    /**
     * Variables
     */
    $: required = !!fieldValidator.validators.required
    $: validState = isTouched
        ? Object.keys(fieldErrors).length
            ? ValidStates.INVALID
            : ValidStates.VALID
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


    /**
     * Lifecycle
     */
    onMount(async () => {
        if (value) {
            isTouched = true
            await validate()
        }
    })

    // Set fieldErrors to an empty object if it is undefined to avoid exceptions
    $: fieldErrors == undefined ? fieldErrors = {} : null
</script>
<div>
    <div class="mb-1">
        <label class="label inline-flex" for={id}>
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
    <div class="relative">
        <textarea
            class="textarea px-2"
            class:resize-none={!resizeY && !resizeX}
            class:resize-y={resizeY}
            class:resize-x={resizeX}
            bind:this={ref}
            bind:value
            {disabled}
            {required}
            {rows}
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
        {#if !disabled && validatorLength}
        <div id="icon" class="absolute top-0 right-1 m-1 p-1 rounded-full bg-slate-200">
            <div class="relative">
              <ValidationLegend.Icon
                {fieldValidator}
                {fieldErrors}
                {validState}
                {legendPopup}
              />
            </div>
          </div>
            <ValidationLegend.Popup {fieldValidator} {fieldErrors} {validState} {legendPopup} />
        {/if}
    </div>
</div>

<style lang="postcss">
    #icon {
        transition: opacity 0.5s;
    }
    textarea:focus + #icon:not(:hover),
    textarea:active + #icon:not(:hover),
    textarea:hover + #icon:not(:hover) {
        /* add fade out class */
        opacity: 0.25;
        background: rgba(0, 0, 0, 0);
    }
</style>