<script lang="ts">
	import * as Icon from "lucide-svelte"

    interface Props {
        amounts?: number[];
        pageCount: PaginatedResponse<any>["pageCount"];
        pageLimit: PaginatedResponse<any>["pageLimit"];
        currentPage: PaginatedResponse<any>["currentPage"];
        previousPage: PaginatedResponse<any>["previousPage"];
        nextPage: PaginatedResponse<any>["nextPage"];

        // Events
        onPageChange: (page: number) => void;
        onPageLimitChange: (pageLimit: number) => void;
    }

    let {
        amounts = [10, 25, 50, 100],
        pageCount,
        pageLimit,
        currentPage,
        previousPage,
        nextPage,

        // Events
        onPageChange,
        onPageLimitChange,
    }: Props = $props();

    function handlePageLimitChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value
        const newPageLimit = parseInt(value) || 25
        onPageLimitChange(newPageLimit)
    }

</script>
{#if pageCount >= 1}
    <div class="flex justify-between">

        <!-- PAGE RESULT LIMIT SELECT -->
        <div>
            <select 
                class="select w-auto" 
                name="Page Limit"
                onchange={handlePageLimitChange}
            >
                {#each amounts as amount}
                    <option value={amount} selected={amount === pageLimit}>
                        {amount} Results
                    </option>
                {/each}
            </select>
        </div>

        <!-- PAGINATOR -->
        <div class="btn-group preset-filled-surface">

            <!-- FIRST PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!previousPage} 
                onclick={() => onPageChange(1)}
                title="First Page"
            >
                <Icon.SkipBack />
            </button>

            <!-- PREVIOUS PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!previousPage} 
                onclick={() => onPageChange(previousPage)}
                title="Previous Page"
            >
                <Icon.ArrowLeft />
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
                disabled={!nextPage} onclick={() => onPageChange(nextPage)}
                title="Next Page"
            >
                <Icon.ArrowRight />
            </button>

            <!-- LAST PAGE -->
            <button 
                class="disabled:opacity-50"
                disabled={!nextPage} onclick={() => onPageChange(pageCount)}
                title="Last Page"
            >
                <Icon.SkipForward />
            </button>

        </div>
    </div>
{/if}
