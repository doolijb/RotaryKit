<script lang="ts">
    import {ValidationBadges, ValidationLegend} from "$client/components"
    import {ValidStates} from "$shared/constants"
    import {createEventDispatcher, onMount} from "svelte"
    import type {PopupSettings} from "@skeletonlabs/skeleton-svelte"
    import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

    const dispatch = createEventDispatcher()

    ////
    // UPSTREAM EXPORTS
    

    const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

    ////
    // LOCAL EXPORTS
    

    interface Props {
        ////
        field: string;
        form: FormSchema;
        data: typeof form["Data"];
        errors: FormErrors;
        resizeY?: boolean;
        rows?: number;
        ////
        ref: HTMLTextAreaElement;
        placeholder?: any;
        label?: string;
        disabled?: boolean;
        id?: string;
        isTouched?: boolean;
        controls?: import('svelte').Snippet;
        extraControls?: import('svelte').Snippet;
    }

    let {
        field,
        form,
        data = $bindable({} as FormDataOf<any>),
        errors = $bindable({}),
        resizeY = false,
        rows = 3,
        ref = $bindable(),
        placeholder = attrs?.placeholder,
        label = attrs?.label,
        disabled = $bindable(false),        id = v4(),
        isTouched = $bindable(false),
        controls,
        extraControls
    }: Props = $props();

    ////
    // STATE
    ////

    let fieldErrors: FieldErrors = $state({})

    ////
    // CALCULATED
    ////

    let fieldValidator = $derived(form.fields[field])
    let validatorLength = $derived(form.fields[field].validators.length)
    let required = $derived(fieldValidator.isRequired)
    let validState = $derived(isTouched
        ? fieldErrors && Object.keys(fieldErrors).length
            ? ValidStates.INVALID
            : data[field]
            ? ValidStates.VALID
            : ValidStates.NONE
        : ValidStates.NONE)

    $effect(() => {
        fieldErrors = errors[field] || {}
    })

    ////
    // FUNCTIONS
    ////

    async function validate() {
		let fieldErrors = await form.fields[field].validate({key:field, data})
		if (Object.keys(fieldErrors).length) {
			errors[field] = fieldErrors
		} else {
			delete errors[field]
		}
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
                <ValidationBadges {fieldValidator} bind:fieldErrors />
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
            oninput={handleOnInput}
            onfocus={handleOnFocus}
            onblur={handleOnBlur}
></textarea>
        {#if controls || extraControls || !disabled && validatorLength || attrs?.description }
            <div class="fieldFooter flex items-center justify-between px-3 py-2 border bg-surface-50 dark:bg-surface-500">
                <div class="inline-flex items-center">
                    {@render controls?.()}
                </div>
                <div class="flex w-100 ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                    {@render extraControls?.()}
                    {#if !disabled && validatorLength}
                        <ValidationLegend {fieldValidator} bind:fieldErrors {validState} {attrs} />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
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
