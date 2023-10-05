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
            on:click={e => {
                e.preventDefault()
                // @ts-ignore
                e.target.event = "click"
            }}
            aria-label={validator.message}
            role="button"
            tabindex="0"
        >
            {validator.badge}
        </span>
        {#if validator.popup}
            <div
                class="card z-10 block p-4"
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
    {/if}
{/each}

<style lang="postcss">
</style>
