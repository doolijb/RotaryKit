<script lang="ts">
	import { ConfirmationModal } from "$client/components/modals"
	import { BoolCell, TextCell } from "$client/components/tableCells"
	import { Popover } from "@skeletonlabs/skeleton-svelte"
	import humanizeString from "humanize-string"
    import pluralize from "pluralize"
    import * as Icon from "lucide-svelte"

	interface Props {
        resource: string
		/** The results to display in the table. */
		result: unknown
        /** The arbitrary list number for this result */
        index: number
		/** Staff user can view resource. */
		canViewResource: boolean
		/** Staff user can edit resource. */
		canEditResource: boolean
		/** Staff user can delete resource. */
		canDeleteResource: boolean
        /** Ordered list of column keys */
        keys: string[]
        dataHandlers?: DataHandlers

		// Events
		onView: (result: Result<any>) => void
		onEdit: (result: Result<any>) => void
		onDelete: (result: Result<any>) => void
	}

	let {
        resource,
		result,
        index,
		canViewResource,
		canEditResource,
		canDeleteResource,
        keys,
        dataHandlers,

		// Events
		onView,
		onEdit,
		onDelete,
	}: Props = $props()

    ////
    // STATE
    ////

    let isMenuOpen = $state(false)
    let isDeleteModalOpen = $state(false)

    ////
    // FUNCTIONS
    ////

    /**
	 * Gets the value from a result,
	 * and performs data handling if present.
	 */
	function getValue(result: Result<any>, key: string): any {
		const value = result[key]
		const retVal = dataHandlers[key]?.handler ? dataHandlers[key].handler(value) : value
		return ![undefined, null].includes(retVal) ? retVal : ""
	}

	/**
	 * Gets the url from a result if present.
	 */
	function getKeyUrl(result: Result<any>, key: string): string | undefined {
		return dataHandlers[key]?.getUrl ? dataHandlers[key].getUrl(result) : undefined
	}

</script>
<tr>
    <!-- ROW NUMBER IN TOTAL RESULTS -->
    <td onclick={() => onView(result)} class="opacity-50 hover:opacity-100 cursor-pointer" title="View">
        {index}
    </td>

    <!-- RESULT DATA COLUMNS -->
    {#each keys as key}
        {#if typeof getValue(result, key) === "boolean"}
            <BoolCell value={!!result[key]} />
        {:else}
            <TextCell text={`${getValue(result, key)}`} url={getKeyUrl(result, key)} />
        {/if}
    {/each}

    <!-- ACTIONS DROPDOWN -->
    <td class="text-center">
<Popover
    bind:open={isMenuOpen}
    positioning={{ placement: 'bottom' }}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-4 space-y-4 max-w-[320px] shadow-xl"
    arrow
    arrowBackground="!bg-surface-100 dark:!bg-surface-900"
>
    {#snippet trigger()}
        <button class=" px-5">
            <span>
                <Icon.EllipsisVertical />
            </span>
        </button>
    {/snippet}
    {#snippet content()}
        <div class="">
            <div class="btn-group-vertical w-full flex flex-col gap-2">
                {#if canViewResource}
                    <button class="btn preset-filled-primary-500" onclick={() => onView(result)}> View </button>
                {/if}

                {#if canEditResource}
                    <button class="btn preset-filled-secondary-500" onclick={() => onEdit(result)}> Edit </button>
                {/if}

                {#if canDeleteResource}
                <ConfirmationModal
                    onConfirm={onDelete}
                    title={`Delete ${pluralize.singular(humanizeString(resource))}`}
                    body={`Are you sure you want to continue?`}
                    data={{result}}
                    cancelButton="Cancel"
                    confirmButton="Delete"
                    confirmButtonPreset="preset-filled-error-500"
                >
                    {#snippet trigger()}
                        <button class="btn preset-filled-error-500"> Delete </button>
                    {/snippet}
                    </ConfirmationModal>
                {/if}
            </div>
        </div>
    {/snippet}
</Popover>
</td>
</tr>