<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="flex justify-center pt-5 px-2 mx-auto min-h-screen bg-surface-50">
    <div class="w-[60rem]">
        {@render children?.()}
    </div>
</div>