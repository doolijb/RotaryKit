<script lang="ts">
    import * as Icon from "lucide-svelte"

    interface Props {
        title?: string | null;
        value?: boolean | null;
    }

    let { title = null, value = null }: Props = $props();

    function getBoolDisplay(value: boolean): string {
        if (typeof value === "undefined" || value === null) {
            return "NONE"
        }
        return value ? "TRUE" : "FALSE"
    }

    const iconWidth = "1.5em"
</script>

<td title={title || getBoolDisplay(value)}>
    <div class="flex items-center items-stretch justify-center">
        {#if value}
            <Icon.CircleCheck
                class="inline"
                width={iconWidth}
            />
        {:else if value === false}
            <Icon.CircleX
                class="text-surface-500"
                width={iconWidth}
            />
        {:else}
            <Icon.CircleOff
                class="text-surface-500"
                width={iconWidth}
            />
        {/if}
    </div>
</td>
