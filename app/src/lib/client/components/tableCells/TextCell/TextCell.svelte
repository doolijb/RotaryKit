<script lang="ts">
    import Icon from "@iconify/svelte"
    import { clipboard, getToastStore } from "@skeletonlabs/skeleton"
    import { Toast } from "$client/utils"
	import moment from "moment"

    export let text: string
    export let copy: string = undefined
    export let url: string = undefined
    let displayText = text

    const toastStore = getToastStore()

    $: copyText = !url && copy ? copy : text
    $: title = copyText ? "Click to copy" : undefined

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

    let focused = false
</script>

<!-- svelte-ignore missing-declaration -->
{#if !text}
    <td/>
{:else if !!url}
    <td
        class="select-none"
        {title}
        on:focus={() => (focused = true)}
        on:focusout={() => (focused = false)}
        on:mouseover={() => (focused = true)}
        on:mouseleave={() => (focused = false)}
    >
        <slot {text}>
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
        </slot>
    </td>
{:else}
    <td
        class="select-none"
        {title}
        use:clipboard={copyText}
        on:click={() => {
            url && window.open(url)
            !url && copyText && toastStore.trigger(new Toast({ message: "Copied to clipboard"}))
        }}
        on:focus={() => (focused = true)}
        on:focusout={() => (focused = false)}
        on:mouseover={() => (focused = true)}
        on:mouseleave={() => (focused = false)}
    >
        <slot {text}>
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
        </slot>
    </td>
{/if}

<style></style>
