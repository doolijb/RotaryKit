<script lang="ts">
	import type { Primitive } from "$validation/base"
    import type { PopupSettings } from "@skeletonlabs/skeleton"

    ////
    // PARENT EXPORTS
    ////

    export let fieldErrors: FieldErrors
    export let fieldValidator: Primitive<unknown>
    export let attrs: FormFieldAttributes | undefined

    ////
    // LOCAL EXPORTS
    ////
    
    export let legendPopup: PopupSettings
    
    ////
    // CALCULATED
    ////

    $: stickyValidators = Object.values(fieldValidator.validators).filter((validator) => validator.isSticky && !validator.isHidden)
    $: dynamicValidators = Object.values(fieldValidator.validators).filter((validator) => !validator.isHidden && !validator.isSticky)
    $: validators = [...stickyValidators, ...dynamicValidators]
    
</script>

{#if validators.length || attrs && attrs.description}
    <div class="card variant-soft z-10 w-96 p-4 shadow-xl" data-popup={legendPopup.target}>
        {#if attrs && attrs.description}
        <h4 class="h4">Description</h4>
            <div class="mt-2">
                <p class="prose-sm">{attrs.description}</p>
            </div>
        {/if}
        {#if validators.length}
            <h4 class="h4 my-2">Requirements</h4>
            {#each Object.values(validators) as validator}
                <div>
                    <span
                        class="badge"
                        class:variant-filled-success={!fieldErrors[validator.key]}
                        class:variant-filled-error={!!fieldErrors[validator.key]}
                    >
                        {validator.badge}
                    </span>
                </div>
                <div class="mb-1 ps-2">
                    <span class="prose-sm">{validator.message}</span>
                </div>
            {/each}
        {/if}
    </div>
{/if}

<style lang="postcss">
</style>
