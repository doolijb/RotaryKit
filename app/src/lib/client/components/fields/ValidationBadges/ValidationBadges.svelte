<script lang="ts">
	import type { Primitive } from "$shared/validation/base"
    import {popup} from "@skeletonlabs/skeleton"
    
    ////
    // PARENT EXPORTS
    ////

    export let fieldErrors: FieldErrors
    export let fieldValidator: Primitive<unknown>
    export let hideRequired = false

    ////
    // CALCULATED
    ////

    $: stickyValidators = Object.values(fieldValidator.validators).filter((validator) => 
        validator.isSticky && 
        !validator.isHidden && 
        validator.popup && 
            ((validator.key === "required" && !hideRequired) || validator.key !== "required" )
        )
    $: dynamicValidators = Object.values(fieldValidator.validators).filter((validator) => !validator.isHidden && !validator.isSticky && !!fieldErrors[validator.key])
    $: validators = [...stickyValidators, ...dynamicValidators].slice(0, 3)

</script>
{#each Object.values(validators) as validator}
    <span
        class="badge ms-1 mb-2 select-none"
        class:variant-soft-primary={!fieldErrors[validator.key]}
        class:variant-soft-error={!!fieldErrors[validator.key]}
        use:popup={validator.popup}
        aria-label={`${validator.message}`}
    >
        {validator.badge}
    </span>
    <div
        class="card z-10 block p-4 hidden"
        class:variant-filled-primary={!fieldErrors[validator.key]}
        class:variant-filled-error={!!fieldErrors[validator.key]}
        data-popup={validator.popup.target}
    >
        <p>{validator.message}</p>
        <div
            class="arrow"
            class:variant-filled-primary={!fieldErrors[validator.key]}
            class:variant-filled-error={!!fieldErrors[validator.key]}
        />
    </div>
{/each}

<style lang="postcss">
</style>
