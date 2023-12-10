<script lang="ts">
    import {ValidStates} from "@constants"
    
    import type {PopupSettings} from "@skeletonlabs/skeleton"

    export let fieldErrors: FieldErrors = {}
    export let legendPopup: PopupSettings
    export let validState = ValidStates.NONE
    export let fieldValidator: FieldValidator
</script>

{#if Object.keys(fieldValidator.validators).length}
    <div class="card variant-filled z-10 w-96 p-4 shadow-xl" data-popup={legendPopup.target}>
        <h4 class="h4 mb-2">Requirements</h4>
        <!-- Present the validators with name and description in a pretty layout -->
        {#each Object.values(fieldValidator.validators) as validator}
            <div>
                <span class="badge variant-filled">
                    {validator.badge}
                </span>
            </div>
            <div class="mb-1 ps-2">
                <span class="prose-sm">{validator.message}</span>
            </div>
        {/each}
        <!-- <div class="arrow bg-surface-100-800-token variant-filled" /> -->
    </div>
{/if}

<style lang="postcss">
</style>
