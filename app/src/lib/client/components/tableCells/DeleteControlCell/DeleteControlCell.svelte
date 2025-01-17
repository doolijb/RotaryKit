<script lang="ts">
    import * as Icon from "lucide-svelte";

    interface Props {
        disabled?: boolean;
        onClick?: (args: any) => void;
        title?: string;
    }

    let { disabled = false, onClick = () => console.log("onClick"), title = "Delete" }: Props = $props();

    let focused = $state(false)
</script>

<td class="select-none py-0" {title}>
    <div class="flex items-center items-stretch justify-center pt-2">
        <button
            type="button"
            class="preset-soft-error btn-icon btn-icon-sm"
            {disabled}
            onclick={onClick}
            onfocus={() => (focused = true)}
            onfocusout={() => (focused = false)}
            onmouseover={() => (focused = true)}
            onmouseleave={() => (focused = false)}
        >
            <Icon.Trash
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
