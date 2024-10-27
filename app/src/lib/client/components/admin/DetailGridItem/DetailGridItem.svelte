<script lang="ts">
	import Icon from "@iconify/svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "$client/utils"
	import humanizeString from "humanize-string"
    import { getDisplayAndCopyText } from "$client/utils"
    import type { Snippet } from "svelte"

    const toastStore = getToastStore()

    ////
    // PROPS
    ////

    interface Props {
        // Props
        label: string;
        value?: string | number | boolean | Date;
        copy?: string;
        humanizeLabel?: boolean;

        // Children
        children?: Snippet<[any]>;
    }

    let {
        // Props
        label,
        value = undefined,
        copy = undefined,
        humanizeLabel = true,

        // Bindables

        // Snippets
        children,

        // Rest
        ...rest
    }: Props = $props();

    ////
    // STATE
    ////

    let displayText = $state()
    let copyText = $state(undefined);
    let focused = $state(false)
    let type = $state("unknown")

    ////
    // FUNCTIONS
    ////

    function copyToClipboard() {
        navigator.clipboard.writeText(copyText as string)
    }

    function onClick() {
        if (canCopy) {
            copyToClipboard()
            toastStore.trigger(new Toast({ message: "Copied to clipboard"}))
        }
    }
    
    ////
    // CALCULATED
    ////

    let canCopy = $derived(copyText !== undefined)

    ////
    // LIFECYCLE
    ////

    if (value === undefined) {
        displayText = "N/A"
    } else {
        let displayAndCopy = getDisplayAndCopyText(value)
        displayText = displayAndCopy.displayText
        copyText === undefined && (copyText = displayAndCopy.copyText)
        type = displayAndCopy.type
    }

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore missing_declaration -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
    class="flex flex-col select-none {rest.class || ''}"
    class:cursor-pointer={canCopy}
    onclick={onClick}
    onfocus={() => (focused = true)}
    onfocusout={() => (focused = false)}
    onmouseover={() => (focused = true)}
    onmouseleave={() => (focused = false)}
    title={canCopy ? "Click to copy" : undefined}
>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="text-sm text-gray-500">
        {humanizeLabel ? humanizeString(label) : label}
    </label>
    <!-- If no slot -->
    {#if children}
        {@render children?.()}
    {:else}
        <p>
            {#if type === "url"}
                <a href={`${value}`} target="_blank" rel="noopener noreferrer">
                    Link
                </a>
                <Icon
                    icon="mdi:open-in-new"
                    class="inline ms-1 {!focused ? "invisible" : ""}"
                />
            {:else if type === "boolean"}
                <Icon icon={value ? "mdi:check" : "mdi:close"} class="w-auto inline" />
                {humanizeString(value.toString())}
                <!-- Is it a date string? -->
            {:else}
                {displayText}
            {/if}
            {#if canCopy}
            <Icon
                icon="mdi:content-copy"
                class="inline ms-1 {!focused ? "invisible" : ""}"
            />
            {/if}
        </p>
    {/if}
</div>