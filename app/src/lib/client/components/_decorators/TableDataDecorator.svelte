<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
    /**
     * This is a decorator that will provide a table for table TD components to be rendered in.
     */
</script>

<div class="flex">
    <div class="flex-initial">
        <table class="table-hover table">
            <thead>
                <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                    <th>Header 3</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {@render children?.()}
                    {@render children?.()}
                    {@render children?.()}
                </tr>
            </tbody>
        </table>
    </div>
</div>
