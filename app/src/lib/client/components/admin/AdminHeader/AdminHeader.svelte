<script lang="ts">
    interface Props {
        title?: import('svelte').Snippet;
        controls?: import('svelte').Snippet;
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