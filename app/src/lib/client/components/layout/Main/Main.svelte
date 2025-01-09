<script lang="ts">
	import type { Snippet } from "svelte"

    
    interface Props {
        width?: string
        children?: Snippet
    }

    let { 
        width = "w-full",
        children
    }: Props = $props()

</script>

<div class="flex flex-col flex-grow p-4 overflow-y-auto">
    <div class="{width}">
        {@render children?.()}
    </div>
</div>
