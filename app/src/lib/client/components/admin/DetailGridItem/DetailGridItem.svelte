<script lang="ts">
	import Icon from "@iconify/svelte"
	import { clipboard, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "$client/utils"
	import humanizeString from "humanize-string"
	import moment from "moment"

    export let label: string
    export let value: string | boolean | number
    export let copy: string = undefined

    const toastStore = getToastStore()
    let copyText = copy ? copy : value
    let focused = false

    const canCopy = typeof copyText === "string" && copyText.length > 0
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="flex flex-col select-none"
    class:cursor-pointer={canCopy}
    on:click={() => {
        canCopy && toastStore.trigger(new Toast({ message: "Copied to clipboard"}))
    }}
    on:focus={() => (focused = true)}
    on:focusout={() => (focused = false)}
    on:mouseover={() => (focused = true)}
    on:mouseleave={() => (focused = false)}
    use:clipboard={canCopy ? `${copyText}` : null}
    title={canCopy ? "Click to copy" : undefined}
>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="text-sm text-gray-500">
        {humanizeString(label)}
    </label>
    <p>
        {#if typeof value === "boolean"}
            <Icon icon={value ? "mdi:check" : "mdi:close"} class="w-auto inline" />
            {humanizeString(value.toString())}
            <!-- Is it a date string? -->
        {:else if moment(value).isValid()}
            {moment(value).format("lll")}
        {:else}
            {value}
        {/if}
        {#if canCopy}
        <Icon
            icon="mdi:content-copy"
            class="inline ms-2 mt-1 {!focused ? "invisible" : ""}"
        />
        {/if}
    </p>
</div>