<script lang="ts">
	import type { IFormErrors, IFormValidator } from "@interfaces"

    export let disabled = false
    export let formData: {[key: string]: any}
    export let formErrors: IFormErrors = {}
    export let formValidator: IFormValidator

    export let onSubmit: (e: Event) => Promise<void>
    export let onCancel: (e: Event) => Promise<void> | undefined = undefined

    export let submitLabel = "Submit"
    export let cancelLabel = "Cancel"

    $: isPopulated = !formValidator.requiredFields.some(field => !formData[field])
    $: hasErrors = Object.keys(formErrors).some(field => Object.keys(formErrors[field]).length)
    $: canSubmit = isPopulated && !hasErrors
    $: console.log("isPopulated", isPopulated)
    $: console.log("hasErrors", hasErrors)
    $: console.log("canSubmit", canSubmit)

    async function validate() {
        formErrors = await formValidator.test(formData)
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