<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "$client/components"
    import {ValidStates} from "$shared/constants"
    import {createEventDispatcher, onMount} from "svelte"
    import type {PopupSettings} from "@skeletonlabs/skeleton"
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
    export let resizeY = false
    export let rows: number = 3

    ////
    // LOCAL EXPORTS
    ////

    export let ref: HTMLTextAreaElement
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
    $: validatorLength = form.fields[field].validators.length
    $: required = fieldValidator.isRequired
    $: validState = isTouched
        ? fieldErrors && Object.keys(fieldErrors).length
            ? ValidStates.INVALID
            : data[field]
            ? ValidStates.VALID
            : ValidStates.NONE
        : ValidStates.NONE

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
        data[field] && touch()
    })

</script>
<div>
    <div class="mb-1">
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
    </div>

    <div class="fieldWrapper rounded w-full flex flex-col mb-4">
        <textarea
            class="textarea rounded px-2 m-0"
            class:resize-none={!resizeY}
            class:resize-y={resizeY}
            bind:this={ref}
            bind:value={data[field]}
            {disabled}
            {required}
            {rows}
            {placeholder}
            on:input={handleOnInput}
            on:focus={handleOnFocus}
            on:blur={handleOnBlur}
        />
        {#if $$slots.controls || $$slots.extraControls || !disabled && validatorLength || attrs?.description }
            <div class="fieldFooter flex items-center justify-between px-3 py-2 border bg-surface-50 dark:bg-surface-500">
                <div class="inline-flex items-center">
                    <slot name="controls" />
                </div>
                <div class="flex w-100 ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                    <slot name="extraControls" />
                    {#if !disabled && validatorLength}
                        <ValidationLegend.Icon {fieldValidator} {fieldErrors} {validState} {legendPopup} />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
    {#if !disabled && validatorLength || attrs?.description}
		<ValidationLegend.Popup {fieldValidator} {fieldErrors} {legendPopup} {attrs} />
	{/if}
</div>

<style lang="postcss">
    .fieldFooter {
        border-color: rgb(var(--color-surface-400));
        border-top: 0;
        border-start-start-radius: 0;
        border-start-end-radius: 0;
    }
    textarea {
        border-color: rgb(var(--color-surface-400));
        border-end-end-radius: 0;
        border-end-start-radius: 0;
    }
</style>