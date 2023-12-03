<script lang="ts">
	import { AdminResultsTable, Pagination, AdminHeader } from "@components"
	import Icon from "@iconify/svelte"
	import { type PopupSettings, popup } from "@skeletonlabs/skeleton"
	import axios, { type AxiosResponse } from "axios"
	import { onMount, setContext } from "svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "@utils"
	import { page } from "$app/stores"
	setContext("page", page)

	const toastStore = getToastStore()

	////
	// VARIABLE PROPS
	////
	export let dataHandlers: {
		[key: string]: {
			header?: string
			handler?: (result: Result<any>) => any
			orderByKey?: string
			getUrl?: (result: Result<any>) => string
		}
	} = {}
	export let orderedKeys: string[] = []
	export let getIdentity: (result: Result<any>) => string = (result: Result<any>) => result.id
	export let resource: string
	export let resourceTitle: string

	////
	// INTERNAL VARIABLES
	////

	let errorLoading = false

	// SEARCH PARAMS
	let searchParam: string = $page.url.searchParams.get("search") || ""
	let orderByParam: string | undefined = $page.url.searchParams.get("orderBy")
	let pageParam: number | undefined = parseInt($page.url.searchParams.get("page"))
	let pageLimitParam: number | undefined = parseInt($page.url.searchParams.get("pageLimit"))

	// PERMISSIONS
	let canCreateResource: boolean = true // TODO
	let canViewResource: boolean = true // TODO
	let canEditResource: boolean = true
	let canDeleteResource: boolean = true
	let response: AxiosResponse | undefined | void // TODO
	let searchTimeoutId: NodeJS.Timeout | undefined

	// REACTIVE
	$: displayTitle = resourceTitle || `${resource.charAt(0).toUpperCase() + resource.slice(1)}s`

	////
	// FUNCTIONS
	////

	function updateUrlParams(): void {
		if (!!response) {
			searchParam = response.data.search
			orderByParam = response.data.orderBy
			pageParam = response.data.currentPage
			pageLimitParam = response.data.pageLimit
		}
		if (!!window && !!window.history) {
			let paramString = ""
			if (!!searchParam) paramString += `search=${searchParam}&`
			if (!!orderByParam) paramString += `orderBy=${orderByParam}&`
			if (!!pageParam) paramString += `page=${pageParam}&`
			if (!!pageLimitParam) paramString += `pageLimit=${pageLimitParam}&`
			window.history.replaceState(
				{},
				"",
				`${$page.url.pathname}${!!paramString ? `?${paramString.slice(0, -1)}` : ""}`
			)
		}
	}

	async function loadResults(): Promise<void> {
		errorLoading = false
		response = await axios
			.get(`/api/admin/${resource}`, {
				params: {
					search: searchParam || undefined,
					orderBy: orderByParam || undefined,
					page: pageParam || undefined,
					pageLimit: pageLimitParam || undefined
				}
			})
			.catch((error) => {
				errorLoading = true
				toastStore.trigger(
					new Toast({
						message: "Failed to load results.",
						style: "error"
					})
				)
				return undefined
			})
		updateUrlParams()
	}

	async function handleOrderByChange(event: CustomEvent<string>): Promise<void> {
		orderByParam = event.detail
		await loadResults()
	}

	async function handlePageChange(event: CustomEvent<number>): Promise<void> {
		pageParam = event.detail
		await loadResults()
	}

	async function handlePageLimitChange(event: CustomEvent<number>): Promise<void> {
		pageLimitParam = event.detail
		await loadResults()
	}

	async function handleViewResult(event: CustomEvent<Result<any>>): Promise<void> {
		const id = getIdentity(event.detail.id)
		// TODO...
	}

	async function handleEditResult(event: CustomEvent<Result<any>>): Promise<void> {
		const id = getIdentity(event.detail.id)
		// TODO...
	}

	async function handleDeleteResult(event: CustomEvent<Result<any>>): Promise<void> {
		const id = getIdentity(event.detail.id)
		// TODO...
	}

	async function handleCreateResource(): Promise<void> {
		// TODO...
	}

	async function handleSearchStringChange(event: Event): Promise<void> {
		clearTimeout(searchTimeoutId)
		searchTimeoutId = setTimeout(loadResults, 500)
	}

	////
	// LIFECYCLE
	////

	onMount(async () => {
		loadResults()
	})
</script>

<AdminHeader>
	<div slot="title">
		<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
		{displayTitle}
	</div>

	<div class="flex justify-between" slot="controls">
		<div>
			<input
				class="input w-auto"
				type="text"
				placeholder="Search"
				bind:value={searchParam}
				on:input={handleSearchStringChange}
			/>
			<button
				class="btn variant-filled"
				disabled={!searchParam}
				on:click={() => {
					searchParam = ""
					loadResults()
				}}
			>
				Reset
			</button>
		</div>
		<button class="btn variant-filled-secondary" on:click={handleCreateResource}>
			<Icon icon="mdi:plus" class="mr-2" />
			Create
		</button>
	</div>
</AdminHeader>

<!-- RESULTS TABLE -->
{#if response && response.data && response.data}
	<AdminResultsTable
		{...response.data}
		{dataHandlers}
		{orderedKeys}
		{canViewResource}
		{canEditResource}
		{canDeleteResource}
		on:orderByChange={(orderBy) => handleOrderByChange(orderBy)}
		on:viewResult={handleViewResult}
		on:editResult={handleEditResult}
		on:deleteResult={handleDeleteResult}
	/>
	<AdminHeader>
		<svelte:fragment slot="controls">
			<Pagination
				{...response.data}
				on:pageLimitChange={(pageLimit) => handlePageLimitChange(pageLimit)}
				on:pageChange={(page) => handlePageChange(page)}
			/>
		</svelte:fragment>
	</AdminHeader>
{:else if errorLoading}
	<div class="flex items-center justify-center mb-2">
		<Icon icon="mdi:alert-circle-outline" class="mr-2" />
		Failed to load results.
		<br />
	</div>
	<div class="flex items-center justify-center">
		<button class="btn variant-filled" on:click={loadResults}>
			<Icon icon="mdi:reload" class="mr-2" />
			Retry
		</button>
	</div>
{:else}
	<div class="flex items-center justify-center">
		<Icon icon="mdi:loading" class="animate-spin text-4xl" />
	</div>
{/if}
