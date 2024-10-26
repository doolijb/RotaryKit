<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
    // Empty Svelte component with a slot
  </script>
  
  {@render children?.()}