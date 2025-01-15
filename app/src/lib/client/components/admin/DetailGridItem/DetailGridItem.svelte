<script lang="ts">
	import Icon from "@iconify/svelte"
	import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import humanizeString from "humanize-string"
    import { getDisplayAndCopyText } from "$client/utils"
    import { getContext, type Snippet } from "svelte"
    import DOMPurify from "isomorphic-dompurify"

    const toast: ToastContext = getContext("toast")

    ////
    // PROPS
    ////

    interface Props {
        // Props
        label: string
        value?: string | number | boolean | Date
        copy?: string
        humanizeLabel?: boolean
        dataType?: "uuid" | "number" | "date" | "url" | "boolean" | "html" | "string"

        // Children
        children?: Snippet

        // Rest
        [key: string]: any
    }

    let {
        // Props
        label,
        value = undefined,
        copy = undefined,
        humanizeLabel = true,
        dataType,

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

    ////
    // FUNCTIONS
    ////

    function copyToClipboard() {
        navigator.clipboard.writeText(copyText as string)
    }

    function onClick() {
        if (canCopy) {
            copyToClipboard()
            toast.create({ description: "Copied to clipboard"})
        }
    }
    
    ////
    // CALCULATED
    ////

    let canCopy = $derived(copyText !== undefined)

    ////
    // LIFECYCLE
    ////

    $effect.pre(() => {
        if (value === undefined) {
            displayText = "N/A"
        } else {
            let displayAndCopy = getDisplayAndCopyText(value, dataType)
            displayText = displayAndCopy.displayText
            if (copyText === undefined) {
                copyText = displayAndCopy.copyText
            }
            if (!dataType) {
                dataType = displayAndCopy.type
            }
        }
    })

</script>


<div 
    class="flex flex-col select-none m-2 {rest.class ? rest.class : ""}"
    class:col-span-full={dataType === "html"}
    class:row-start-[100]={dataType === "html"}
    class:cursor-pointer={canCopy}
    onclick={onClick}
    onfocus={() => (focused = true)}
    onfocusout={() => (focused = false)}
    onmouseover={() => (focused = true)}
    onmouseleave={() => (focused = false)}
    title={canCopy ? "Click to copy" : undefined}
    role={ canCopy ? "button" : undefined }
    {...rest}
>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="text-sm text-gray-500">
        {humanizeLabel ? humanizeString(label) : label}
    </label>
    <!-- If no slot -->
    {#if children}
        {@render children?.()}
    {:else}
        <p 
            class:card={dataType === "html"} 
            class:preset-soft={dataType === "html"} 
            class:p-4={dataType === "html"}
        >
            {#if dataType === "url"}
                <a href={`${value}`} target="_blank" rel="noopener noreferrer">
                    Link
                </a>
                <Icon
                    icon="mdi:open-in-new"
                    class="inline ms-1 {!focused ? "invisible" : ""}"
                />
            {:else if dataType === "boolean"}
                <Icon icon={value ? "mdi:check" : "mdi:close"} class="w-auto inline" />
                {humanizeString(value.toString())}
                <!-- Is it a date string? -->
            {:else if dataType === "html"}
                {@html DOMPurify.sanitize(`${value}`)}
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
