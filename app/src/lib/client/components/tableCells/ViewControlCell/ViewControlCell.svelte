<script lang="ts">
    import * as Icon from "lucide-svelte"

    interface Props {
        disabled?: boolean
        onClick?: any
        title?: string
    }

    let { disabled = false, onClick = (args: any) => console.log("onClick"), title = "View" }: Props = $props();

    let focused = $state(false)
</script>

<td class="select-none" {title}>
    <div class="flex items-center items-stretch justify-center py-2">
        <button
            type="button"
            class="preset-soft-primary btn-icon btn-icon-sm"
            {disabled}
            onclick={onClick}
            onfocus={() => (focused = true)}
            onfocusout={() => (focused = false)}
            onmouseover={() => (focused = true)}
            onmouseleave={() => (focused = false)}
        >
            <Icon.Eye
                width="1.5em"
                class={!focused ? "opacity-75" : "opacity-100"}
            />
        </button>
    </div>
</td>

<style>
    td {
        padding: 0 !important;
    }
</style>
