<script lang="ts">
    import {ValidStates} from "$shared/constants"
	import type { Primitive } from "$shared/validation/base"
    import Icon from "@iconify/svelte"
    import {onMount} from "svelte"

    ////
    // PARENT EXPORTS
    

    interface Props {
        ////
        fieldErrors: FieldErrors;
        fieldValidator: Primitive<unknown>;
        legendPopup: PopupSettings;
        validState: ValidStates;
    }

    let {
        fieldErrors = $bindable({}),
        fieldValidator,
        legendPopup,
        validState
    }: Props = $props();

    ////
    // CALCULATED
    ////

    let legendIcon: HTMLDivElement = $state()

    let validatorLength = $derived(Object.keys(fieldValidator).length)

    onMount(() => {
        // Enforce OOP to give elements a chance to render
        // before we try to attach the popup
        if (validatorLength) {
            // popup(legendIcon, legendPopup)
        }
    })
</script>

{#if validatorLength}
    <!-- svelte-ignore a11y_click_events_have_key_events The event is required for event behavior to work as intended -->
    <!-- We need to execute the attached event, and prevent populating up on click -->
    <div
        class="legendIconWrapper cursor-pointer {validState === ValidStates.NONE ? "hover:opacity-100 opacity-50" : ""}"
        tabindex="-1"
        bind:this={legendIcon}
        onclick={e => {
            e.preventDefault()
            // @ts-ignore
            e.target.event = "click"
        }}
        aria-label="Legend"
        title="Legend"
        role="button"
    >
        {#if validState === ValidStates.INVALID}
            <Icon
                icon="material-symbols:warning"
                class="pointer-events-none text-error-500"
                width="2em"
            />
        {:else if validState === ValidStates.VALID}
            <Icon
                icon="material-symbols:check-small"
                class="pointer-events-none text-success-700"
                width="2em"
            />
        {:else}
            <Icon
                icon="ic:sharp-minus"
                class="pointer-events-none text-surface-500"
                width="2em"
            />
        {/if}
    </div>
{/if}

<style lang="postcss">
    .legendIconWrapper {
        padding: 0;
    }
</style>
