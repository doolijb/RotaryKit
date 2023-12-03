<script lang="ts">
	import Icon from "@iconify/svelte"
    import { createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()

    export let amounts: number[] = [10, 25, 50, 100]
    export let pageCount: PaginatedResponse<any>["pageCount"]
    export let pageLimit: PaginatedResponse<any>["pageLimit"]
    export let currentPage: PaginatedResponse<any>["currentPage"]
    export let previousPage: PaginatedResponse<any>["previousPage"]
    export let nextPage: PaginatedResponse<any>["nextPage"]

    function onPageLimitChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value
        const newPageLimit = parseInt(value) || 25
        dispatch("pageLimitChange", newPageLimit)
    }

    function onPageChange(page: number) {
        dispatch("pageChange", page)
    }

</script>
{#if pageCount >= 1}
    <div class="flex justify-between">

        <!-- PAGE RESULT LIMIT SELECT -->
        <div>
            <select 
                class="select w-auto" 
                name="Page Limit"
                on:change={onPageLimitChange}
            >
                {#each amounts as amount}
                    <option value={amount} selected={amount === pageLimit}>
                        {amount} Results
                    </option>
                {/each}
            </select>
        </div>

        <!-- PAGINATOR -->
        <div class="btn-group variant-filled-surface">

            <!-- FIRST PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!previousPage} 
                on:click={() => onPageChange(1)}
                title="First Page"
            >
                <Icon icon="mdi:page-first" />
            </button>

            <!-- PREVIOUS PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!previousPage} 
                on:click={() => onPageChange(previousPage)}
                title="Previous Page"
            >
                <Icon icon="mdi:chevron-left" />
            </button>

            <!-- DESCRIPTION -->
            <div class="flex flex-col justify-center opacity-50 px-2 select-none">
                <span>
                    Page {currentPage} of {pageCount}
                </span>
            </div>

            <!-- NEXT PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!nextPage} on:click={() => onPageChange(nextPage)}
                title="Next Page"
            >
                <Icon icon="mdi:chevron-right" />
            </button>

            <!-- LAST PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!nextPage} on:click={() => onPageChange(pageCount)}
                title="Last Page"
            >
                <Icon icon="mdi:page-last" />
            </button>

        </div>
    </div>
{/if}