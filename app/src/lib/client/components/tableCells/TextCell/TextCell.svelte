<script lang="ts">
    import Icon from "@iconify/svelte"
    import { getDisplayAndCopyText } from "$client/utils"
    import { getContext, type Snippet } from "svelte"
	import type { ToastContext } from "@skeletonlabs/skeleton-svelte"

    type ValueType = "unknown" | "uuid" | "number" | "date" | "url" | "boolean"

    const toast: ToastContext = getContext("toast")

    ////
    // PROPS
    ////

    interface Props {
        // Props
        text: string
        copy?: string
        url?: string;

        // Children
        children?: Snippet<[any]>;
    }

    let {
        text,
        copy,
        url,
        
        // Children,
        children
    }: Props = $props();

    ////
    // STATE
    ////

    let displayText = $state()
    let focused = $state(false)
    let copyText = $state(undefined)
    let type = $state("unknown")

    ////
    // FUNCTIONS
    ////

    function isNumber(value: number | string): boolean {
        if (typeof value === 'number') {
            return !isNaN(value) && isFinite(value);
        } else if (typeof value === 'string') {
            return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
        }
        return false;
    }

    function isDate(value: string): boolean {
        // Regular expression to match common date formats including ISO 8601
        const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        return dateRegex.test(value);
    }

    function isUUID(value: string): boolean {
        return value.length === 36 && value[8] === "-" && value[13] === "-" && value[18] === "-" && value[23] === "-";
    }

    function differentiate(value: number | string | boolean): ValueType {
        if (typeof value === 'boolean') {
            return 'boolean'
        } else if (typeof value === 'string' && value.startsWith("http")) {
            return 'url';
        } else if (typeof value === 'string' && isUUID(value)) {
            return 'uuid';
        } else if (typeof value === 'string' && isDate(value)) {
            return 'date';
        } else if (isNumber(value)) {
            return 'number';
        } else {
            return 'unknown';
        }
    }

    ////
    // CALCULATED
    ////

    let title = $derived(copyText ? "Click to copy" : undefined)
    let canCopy = $derived(copyText !== undefined)


    $effect.pre(() => {if (text === undefined) {
            displayText = "N/A"
        } else {
            let displayAndCopy = getDisplayAndCopyText(text, "string")
            displayText = displayAndCopy.displayText
            copyText === undefined && (copyText = displayAndCopy.copyText)
            type = displayAndCopy.type
        }
    })

</script>


{#if !text}
    <td></td>
{:else if !!url}
    <td
        class="select-none"
        {title}
        onfocus={() => (focused = true)}
        onfocusout={() => (focused = false)}
        onmouseover={() => (focused = true)}
        onmouseleave={() => (focused = false)}
    >
        {#if children}{@render children({ text, })}{:else}
            <span class="flex">
                <a 
                    href={url} 
                    title="Click to open"
                    class="hover:underline"
                >
                    {displayText}
                </a>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ms-2 mt-1 {!focused ? "invisible" : ""}"
                    title="Click to open in new tab"
                >
                    <Icon icon="mdi:open-in-new" />
                </a>
            </span>
        {/if}
    </td>
{:else}
    <td
        class="select-none"
        {title}
        onclick={() => {

            url && window.open(url)
            !url && navigator.clipboard.writeText(text) && canCopy && toast.create({ description: "Copied to clipboard"})
        }}
        onfocus={() => (focused = true)}
        onfocusout={() => (focused = false)}
        onmouseover={() => (focused = true)}
        onmouseleave={() => (focused = false)}
    >
        {#if children}{@render children({ text, })}{:else}
            <span class="flex">
                <span>
                    {displayText}
                </span>
                {#if canCopy}
                    <span>
                        <Icon
                            icon="mdi:content-copy"
                            class="ms-2 mt-1 {!focused ? "invisible" : ""}"
                        />
                    </span>
                {/if}
            </span>
        {/if}
    </td>
{/if}
