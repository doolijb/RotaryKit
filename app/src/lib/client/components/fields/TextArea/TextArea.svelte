<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "$client/components"
    import {ValidStates} from "$shared/constants"
    import {createEventDispatcher, onMount} from "svelte"
    import type {PopupSettings} from "@skeletonlabs/skeleton-svelte"
    import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

    const dispatch = createEventDispatcher()

    ////
    // LOCAL EXPORTS
    

    interface Props {

        field: string;
        form: FormSchema;
        resizeY?: boolean;
        rows?: number;
        ref?: HTMLTextAreaElement | null;
        placeholder?: any;
        label?: string;
        disabled?: boolean;
        id?: string;
        showLegend?: boolean;
        controls?: import('svelte').Snippet;
        extraControls?: import('svelte').Snippet;
    }

    let {
        field,
        form,
        resizeY = false,
        rows = 3,
        ref = $bindable(),
        placeholder,
        label,
        id = v4(),
        disabled = $bindable(false),
        showLegend = true,
        controls,
        extraControls
    }: Props = $props();

    const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

    if (placeholder === undefined) placeholder = attrs?.placeholder
    if (label === undefined) label = attrs?.label

    ////
    // STATE
    ////

    let fieldErrors: FieldErrors = $state({})
    let validState = $state(ValidStates.NONE)

    ////
    // CALCULATED
    ////

    let fieldValidator = $derived(form.fields[field])
    let validatorLength = $derived(form.fields[field].validators.length)
    let required = $derived(fieldValidator.isRequired)

    $effect(() => {
        fieldErrors = formCtx.errors[field] || {}
    })

    ////
    // FUNCTIONS
    ////

    async function touch() {
        formCtx.touchedFields[field] = true
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

</script>
<div>
    <div class="mb-1">
        <div class="flex items-center">
            <label class="label-text inline-flex pb-2" for={id}>
                <span class="cursor-pointer select-none" class:text-gray-500={disabled}>
                    {label}
                </span>
            </label>
            {#if !disabled}
                <ValidationBadges {fieldValidator} {form} {field} />
            {/if}
        </div>
    </div>

    <div class="fieldWrapper rounded-xs w-full flex flex-col mb-4">
        <textarea
            class="textarea rounded-xs px-2 m-0"
            class:resize-none={!resizeY}
            class:resize-y={resizeY}
            bind:this={ref}
            bind:value={formCtx.data[field]}
            {disabled}
            {required}
            {rows}
            {placeholder}
            oninput={handleOnInput}
            onfocus={handleOnFocus}
            onblur={handleOnBlur}
></textarea>
        {#if controls || extraControls || !disabled && (showLegend && (validatorLength || attrs?.description))  }
            <div class="fieldFooter flex items-center justify-between px-3 py-2 border bg-surface-50 dark:bg-surface-500">
                <div class="inline-flex items-center">
                    {@render controls?.()}
                </div>
                <div class="flex w-100 ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                    {@render extraControls?.()}
                    {#if !disabled && validatorLength && showLegend}
                        <ValidationLegend {fieldValidator} {form} {field} {attrs} />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
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
