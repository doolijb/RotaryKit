<script lang="ts">
    import type { Snippet } from "svelte"

    interface Props {
        title?: Snippet;
        controls?: Snippet;
    }

    let { title, controls }: Props = $props();
</script>

<div>
    <!-- TITLE -->
    
    <!-- TOOLBAR -->
    <div class="card mb-4 variant-soft p-4">
        <h1 class="h4 w-auto mb-2">
            {@render title?.()}
        </h1>
        <div>
            {@render controls?.()}
        </div>
    </div>

</div> 