<script lang="ts">
    import "../src/app.css"

    type Props = {
      children?: import('svelte').Snippet;
    };
  
    /** @type {Props} */
    let { children }: Props = $props();

</script>

<div data-theme="cerberus" class="dark">
    <div class="w-fit m-[3em]">
        {@render children()}
    </div>
</div>