<script lang="ts">
    import type { Component, Snippet } from "svelte"

    interface Props {
        title?: Snippet
        controls?: Snippet
        icon?: Snippet
    }

    let { 
        title, 
        controls, 
        icon 
    }: Props = $props();
</script>

<div>
    <div class="card preset-tonal rounded mb-4 p-4">
        {#if icon || title}
            <h1 class="h4 w-auto mb-2 flex gap-2 items-center">
                {#if icon}
                    <span class="mt-[2px]">
                        {@render icon?.()}
                    </span>
                {/if}
                {#if title}
                    <span>
                        {@render title?.()}
                    </span>
                {/if}
            </h1>
        {/if}
        <div>
            {@render controls?.()}
        </div>
    </div>
</div> 
