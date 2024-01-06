<script lang="ts">
	import { BoolCell, TextCell } from "$components"
	import Icon from "@iconify/svelte"
	import { popup } from "@skeletonlabs/skeleton"
	import { createEventDispatcher } from "svelte"

	/**
	 * @fires orderByChange - Dispatched when an orderable table header is clicked, returns an updated orderBy query string.
	 * @fires viewResult - Dispatched when the view button is clicked, returns the result.
	 * @fires editResult - Dispatched when the edit button is clicked, returns the result.
	 * @fires deleteResult - Dispatched when the delete button is clicked, returns the result.
	 */
	const dispatch = createEventDispatcher()

	////
	// VARIABLE PROPS
	////

	/** The results to display in the table. */
	export let results: PaginatedResponse<any>["results"]
	/** The orderBy query string. */
	export let orderBy: PaginatedResponse<any>["orderBy"]
	/** The total number of results. */
	export let totalCount: PaginatedResponse<any>["totalCount"]
	/** The sequence of the first result. */
	export let resultStart: PaginatedResponse<any>["resultStart"]
	/** The sequence of the last result. */
	export let resultEnd: PaginatedResponse<any>["resultEnd"]
	/** Manually set the priority of keys in the table. Optional */
	export let orderedKeys: string[] = []
	/** Manually exclude keys from the table. Optional */
	export let excludeKeys: string[] = []
	/** Staff user can view resource. */
	export let canViewResource: boolean
	/** Staff user can edit resource. */
	export let canEditResource: boolean
	/** Staff user can delete resource. */
	export let canDeleteResource: boolean
	/**
	 * Manually handle how data is displayed for a key in the table.
	 * Recommended for displaying nested data. Optional
	 */
	export let dataHandlers: {
		[key: string]: {
			header?: string
			handler?: (result: Result<any>) => any
			orderByKey?: string
			getUrl?: (result: Result<any>) => string
		}
	} = {}

	////
	// EVENTS
	////
	
	async function onOrderByChange(key: string) {
		// Get current direction
		const currentDirection: string | undefined = orderByArray.find(
			(orderBy) => orderBy.key === key
		)?.direction

		// Create new orderByArray
		const newOrderByArray = [...orderByArray]

		// Determine how to update the orderBy direction
		switch (currentDirection) {
			case "asc":
				// Change to desc
				newOrderByArray.find((orderBy) => orderBy.key === key).direction = "desc"
				break
			case "desc":
				// Remove from array
				newOrderByArray.splice(
					newOrderByArray.findIndex((orderBy) => orderBy.key === key),
					1
				)
				break
			default:
				// Add to array
				newOrderByArray.push({ key, direction: "asc" })
				break
		}

		// Convert newOrderByArray to string
		const orderByArrayString = newOrderByArray
			.map((orderBy) => `${orderBy.key}:${orderBy.direction}`)
			.join(",")
		dispatch("orderByChange", orderBy)
	}

	async function onViewResult(result: Result<any>) {
		dispatch("viewResult", result)
	}

	function onEditResult(result: Result<any>) {
		dispatch("editResult", result)
	}

	function onDeleteResult(result: Result<any>) {
		dispatch("deleteResult", result)
	}

	////
	// INTERNAL VARIABLES
	////

	/**
	 * We can't trust that every result has every key.
	 * So we need to get a list of all keys from all results.
	 * Add them to orderedKeys
	 */
	$: finalOrderedKeys = [
		...orderedKeys,
		...(results.reduce((acc: string[], result): string[] => {
			Object.keys(result).forEach((key) => {
				if (!orderedKeys.includes(key) && !acc.includes(key) && !excludeKeys.includes(key)) {
					acc.push(key)
				}
			})
			return acc
		}, []) as string[])
	]

	/**
	 * Parse OrderBy and OrderDirection
	 * i.e. "createdAt:asc,username:desc" => [{key: "createdAt", direction: "asc"}, {key: "username", direction: "desc"}]
	 */
	$: orderByArray = orderBy.split(",").map((orderBy) => {
		const [key, direction] = orderBy.split(":")
		return { key, direction }
	})

	/**
	 * Create popup settings for each result.
	 */
	$: actionPopupSettings = results.reduce((acc, result) => {
		acc[String(result.id)] = {
			event: "focus-click",
			target: `actionListbox-${result.id}`,
			placement: "bottom"
		}
		return acc
	}, {})

	////
	// HELPERS
	////

	/**
	 * Take a key and make it human readable.
	 * Camel case is converted to title case.
	 * Title case has spaces added between words.
	 */
	function getKeyDisplay(key: string): string {
		const header = dataHandlers[key]?.header || key
		return header
			.replace(/_/g, " ")
			.replace(/(?: |\b)(\w)/g, (key) => key.toUpperCase())
			.replace(/([A-Z])/g, " $1")
	}

	/**
	 * Check if the key is in the in the dataHandlers object.
	 * If it is, return the orderByKey.
	 * If it isn't, just return the key.
	 */
	function getOrderByKey(key: string): string | undefined {
		if (!!dataHandlers[key]) {
			return dataHandlers[key].orderByKey
		}
		return key
	}

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

{#if results.length}
	<!-- DISPLAY TABLE OF RESULTS -->
	<div class="table-container mb-4">
		<table class="table-hover table text-inherit variant-soft">
			<!-- TABLE HEADER -->
			<thead>
				<tr>
					<!-- ROW NUMBER -->
					<th class="opacity-50 select-none"> # </th>

					<!-- RESULT DATA HEADERS -->
					{#each finalOrderedKeys as key}
						{#if getOrderByKey(key)}
							<th on:click={() => onOrderByChange(key)}>
								<button class="hover:underline">
									{getKeyDisplay(key)}
									{#if orderByArray.find((orderBy) => orderBy.key === getOrderByKey(key))}
										{#if orderByArray.find((orderBy) => orderBy.key === getOrderByKey(key)).direction === "asc"}
											<Icon icon="akar-icons:arrow-up" style="display: inline-block" />
										{:else if orderByArray.find((orderBy) => orderBy.key === getOrderByKey(key)).direction === "desc"}
											<Icon icon="akar-icons:arrow-down" style="display: inline-block" />
										{/if}
									{/if}
								</button>
							</th>
						{:else}
							<th class="opacity-50 select-none">
								{getKeyDisplay(key)}
							</th>
						{/if}
					{/each}

					<!-- ACTIONS HEADER -->
					{#if canViewResource || canEditResource || canDeleteResource}
						<th class="text-center opacity-50">
							<!-- COG icon -->
							<Icon icon="mdi:cog" style="display: inline-block" />
						</th>
					{/if}
				</tr>
			</thead>

			<!-- TABLE BODY -->
			<tbody>
				{#each results as result, idx (result.id)}
					<!-- RESULT ROW -->
					<tr>
						<!-- ROW NUMBER IN TOTAL RESULTS -->
						<td class="opacity-50">
							{idx + resultStart}
						</td>

						<!-- RESULT DATA COLUMNS -->
						{#each finalOrderedKeys as key}
							{#if typeof getValue(result, key) === "boolean"}
								<BoolCell value={!!result[key]} />
							{:else}
								<TextCell text={`${getValue(result, key)}`} url={getKeyUrl(result, key)} />
							{/if}
						{/each}

						<!-- ACTIONS DROPDOWN -->
						{#if canViewResource || canEditResource || canDeleteResource}
							<td class="text-center">
								<button use:popup={actionPopupSettings[String(result["id"])]} class=" px-5">
									<span>
										<Icon icon="akar-icons:more-vertical" />
									</span>
								</button>
								<div
									class="card w-48 shadow-xl p-0 z-50"
									data-popup={actionPopupSettings[String(result["id"])].target}
								>
									<div class="arrow bg-primary-500-backdrop-token" />
									<div class="btn-group-vertical variant-filled w-full">
										{#if canViewResource}
											<button on:click={() => onViewResult(result)}> View </button>
										{/if}

										{#if canEditResource}
											<button on:click={() => onEditResult(result)}> Edit </button>
										{/if}

										{#if canDeleteResource}
											<button on:click={() => onDeleteResult(result)}> Delete </button>
										{/if}
									</div>
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>

			<!-- TABLE FOOTER -->
			<tfoot>
				<tr>
					<!-- RESULTS DETAILS -->
					<td colspan={finalOrderedKeys.length + 2}>
						<p class="text-gray-500 text-center normal-case">
							Displaying {resultStart} - {resultEnd} of {totalCount} results
						</p>
					</td>
				</tr>
			</tfoot>
		</table>

		<!-- <Paginator {pageCount} class="mt-1" /> -->
	</div>
{:else}
	<!-- DISPLAY NO RESULTS TEXT -->
	<div class="flex flex-col items-center justify-center">
		<p class="text-gray-500 text-center h4 my-5">No results found</p>
	</div>
{/if}

<style>
	th {
		white-space: nowrap;
	}
</style>
