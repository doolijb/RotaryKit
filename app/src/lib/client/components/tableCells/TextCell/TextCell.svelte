<script lang="ts">
    import Icon from "@iconify/svelte"
    import { clipboard, getToastStore } from "@skeletonlabs/skeleton"
    import { Toast } from "$client/utils"
	import moment from "moment"

    interface Props {
        text: string;
        copy?: string;
        url?: string;
        children?: import('svelte').Snippet<[any]>;
    }

    let {
        text,
        copy = $bindable(undefined),
        url = undefined,
        children
    }: Props = $props();
    let displayText = $state(text)

    const toastStore = getToastStore()

    let copyText = $derived(!url && copy ? copy : text)
    let title = $derived(copyText ? "Click to copy" : undefined)

    /**
     * Check if text is a UUID value and truncate it,
     * Or if it is a date value and format it.
     */
    if (text.length === 36 && text[8] === "-" && text[13] === "-" && text[18] === "-" && text[23] === "-") {
            displayText = text.slice(0, 8)
    } else if (moment(text).isValid()) {
        const date = new Date(text)
        displayText = moment(date).format("lll")
        !copy && (copy = displayText)
    }

    let focused = $state(false)
</script>

<!-- svelte-ignore missing_declaration -->
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
        use:clipboard={copyText}
        onclick={() => {
            url && window.open(url)
            !url && copyText && toastStore.trigger(new Toast({ message: "Copied to clipboard"}))
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
                {#if copyText}
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

<style></style>
