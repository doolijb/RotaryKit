<script lang="ts">
    import {createEventDispatcher} from "svelte"
    
    const dispatch = createEventDispatcher()

    export let disabled = false
    export let formData: {[key: string]: any}
    export let formErrors: FormErrors = {}
    export let formValidator: FormValidator

    export let submitLabel = "Submit"
    export let cancelLabel = "Cancel"
    export let canSubmit = false

    $: isPopulated = !formValidator.requiredFields.some(field => !formData[field])
    $: hasErrors = Object.keys(formErrors).some(field => Object.keys(formErrors[field]).length)
    $: {canSubmit = isPopulated && !hasErrors}

    async function validate() {
        formErrors = await formValidator.test(formData)
    }


    ////
    // Event Handlers
    ////

    const onSubmit = async (e: Event) => {
        await validate()
        dispatch("submit", e)
    }

    const onCancel = async (e: Event) => {
        dispatch("cancel", e)
    }

</script>

<div>
    <slot />

    <div class="flex flex-row space-x-2">
        <slot name="submit">
            <button 
                type="button" 
                class="btn variant-filled-primary"
                disabled={!canSubmit || disabled}
                on:click={async (e) => {
                    disabled = true
                    validate()
                    canSubmit && onSubmit && await onSubmit(e)
                    disabled = false
                }}
            >
                {submitLabel}
            </button>
        </slot>
        <slot name="cancel">
            {#if onCancel !== undefined}
                <button 
                    type="button" 
                    class="btn variant-filled-surface"
                    disabled={disabled}
                    on:click={onCancel}
                >
                    {cancelLabel}
                </button>
            {/if}
        </slot>
        <!-- Cancel button, etc -->
        <slot name="extraButtons" />
    </div>
</div>