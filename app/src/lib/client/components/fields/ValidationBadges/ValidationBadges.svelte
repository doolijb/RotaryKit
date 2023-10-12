<script lang="ts">
    import {popup} from "@skeletonlabs/skeleton"
    import type {IFieldValidator, IFieldErrors} from "@interfaces"

    export let fieldErrors: IFieldErrors = {}
    export let fieldValidator: IFieldValidator
</script>

{#each Object.entries(fieldValidator.validators) as [validatorName, validator]}
    {#if validator.sticky || fieldErrors[validatorName]}
        <!-- svelte-ignore a11y-click-events-have-key-events Required to make cursor behavior work as intended-->
        <span
            class="badge ms-1 select-none"
            class:variant-soft-primary={!fieldErrors[validatorName]}
            class:variant-soft-error={!!fieldErrors[validatorName]}
            use:popup={validator.popup}
            aria-label={validator.message}
        >
            {validator.badge}
        </span>
        <div
            class="card z-10 block p-4 hidden"
            class:variant-filled-primary={!fieldErrors[validatorName]}
            class:variant-filled-error={!!fieldErrors[validatorName]}
            data-popup={validator.popup.target}
        >
            <p>{validator.message}</p>
            <div
                class="arrow"
                class:variant-filled-primary={!fieldErrors[validatorName]}
                class:variant-filled-error={!!fieldErrors[validatorName]}
            />
        </div>
    {/if}
{/each}

<style lang="postcss">
</style>
