<script lang="ts">
	import Icon from "@iconify/svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "$client/utils"
	import humanizeString from "humanize-string"
	import moment from "moment"

    interface Props {
        label: string;
        value?: string | boolean | number;
        copy?: string;
        humanizeLabel?: boolean;
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        label,
        value = undefined,
        copy = undefined,
        humanizeLabel = true,
        children,
        ...rest
    }: Props = $props();

    const toastStore = getToastStore()
    let copyText = copy ? copy : value
    let focused = $state(false)

    let isUrl = $derived(value && typeof value === "string" && value.startsWith("http"))
    let canCopy = $derived(!isUrl && typeof copyText === "string" && copyText.length > 0)

    function copyToClipboard() {
        navigator.clipboard.writeText(copyText as string)
    }

    function onClick() {
        if (canCopy) {
            copyToClipboard()
            toastStore.trigger(new Toast({ message: "Copied to clipboard"}))
        }
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
            {#if isUrl}
                <a href={`${value}`} target="_blank" rel="noopener noreferrer">
                    Link
                </a>
                <Icon
                    icon="mdi:open-in-new"
                    class="inline ms-1 {!focused ? "invisible" : ""}"
                />
            {:else if typeof value === "boolean"}
                <Icon icon={value ? "mdi:check" : "mdi:close"} class="w-auto inline" />
                {humanizeString(value.toString())}
                <!-- Is it a date string? -->
            {:else if value === undefined}
                <span class="text-gray-400">N/A</span>
            {:else if moment(value).isValid()}
                {moment(value).format("lll")}
            {:else}
                {value}
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