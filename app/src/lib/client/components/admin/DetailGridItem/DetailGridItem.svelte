<script lang="ts">
	import Icon from "@iconify/svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "$client/utils"
	import humanizeString from "humanize-string"
	import moment from "moment"

    export let label: string
    export let value: string | boolean | number = undefined
    export let copy: string = undefined
    export let humanizeLabel: boolean = true

    const toastStore = getToastStore()
    let copyText = copy ? copy : value
    let focused = false

    $: isUrl = value && typeof value === "string" && value.startsWith("http")
    $: canCopy = !isUrl && typeof copyText === "string" && copyText.length > 0

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="flex flex-col select-none {$$restProps.class || ''}"
    class:cursor-pointer={canCopy}
    on:click={onClick}
    on:focus={() => (focused = true)}
    on:focusout={() => (focused = false)}
    on:mouseover={() => (focused = true)}
    on:mouseleave={() => (focused = false)}
    title={canCopy ? "Click to copy" : undefined}
>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="text-sm text-gray-500">
        {humanizeLabel ? humanizeString(label) : label}
    </label>
    <!-- If no slot -->
    {#if $$slots.default}
        <slot />
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