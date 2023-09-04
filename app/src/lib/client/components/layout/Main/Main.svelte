<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="flex justify-center pt-5 px-2 mx-auto">
    <div class="w-[80rem]">
        {@render children?.()}
    </div>
</div>