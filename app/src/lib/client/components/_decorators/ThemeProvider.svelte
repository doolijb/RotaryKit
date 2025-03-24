<script lang="ts">
    import "../../../../app.css"
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    type Props = {
      children?: import('svelte').Snippet;
    };
  
    /** @type {Props} */
    let { children }: Props = $props();

</script>

<html lang="en" class="theme-cerberus">
    <body data-sveltekit-preload-data="hover" class="min-h-screen overflow-y-auto">
        <div>
            {@render children?.()}
        </div>
    </body>
</html>

<style>
    div {
        margin: 3em;
    }
</style>