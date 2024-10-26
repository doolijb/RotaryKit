<script lang="ts">
	import type { Primitive } from "$shared/validation/base"
    import type { PopupSettings } from "@skeletonlabs/skeleton"

    ////
    // PARENT EXPORTS
    


    ////
    // LOCAL EXPORTS
    
    
    interface Props {
        ////
        fieldErrors: FieldErrors;
        fieldValidator: Primitive<unknown>;
        attrs: FormFieldAttributes | undefined;
        ////
        legendPopup: PopupSettings;
    }

    let {
        fieldErrors,
        fieldValidator,
        attrs,
        legendPopup
    }: Props = $props();
    
    ////
    // CALCULATED
    ////

    let stickyValidators = $derived(Object.values(fieldValidator.validators).filter((validator) => validator.isSticky && !validator.isHidden))
    let dynamicValidators = $derived(Object.values(fieldValidator.validators).filter((validator) => !validator.isHidden && !validator.isSticky))
    let validators = $derived([...stickyValidators, ...dynamicValidators])
    
</script>

{#if validators.length || attrs && attrs.description}
    <div class="card variant-filled z-10 w-96 p-4 shadow-xl" data-popup={legendPopup.target}>
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
