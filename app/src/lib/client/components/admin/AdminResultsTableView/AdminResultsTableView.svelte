<script lang="ts">
	import { AdminResultsTable, Pagination, AdminHeader, Loading } from "$components"
	import Icon from "@iconify/svelte"
	import { type PopupSettings, popup, getModalStore } from "@skeletonlabs/skeleton"
	import axios, { type AxiosResponse } from "axios"
	import { onMount, setContext } from "svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast, hasAdminPermission } from "$utils"
	import { page } from "$app/stores"
	import { goto, invalidateAll } from "$app/navigation"
	import humanizeString from "humanize-string"
	import { plural } from "pluralize"

	setContext("page", page)

	const toastStore = getToastStore()
	const modalStore = getModalStore()

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
	export let getResourceId: (result: Result<any>) => string = (result: Result<any>) => result.id
	export let resource: string

	////
	// INTERNAL VARIABLES
	////

	let errorLoading = false

	// SEARCH PARAMS
	let searchParam: string = $page.url.searchParams.get("search") || ""
	let orderByParam: string | undefined = $page.url.searchParams.get("orderBy")
	let pageParam: number | undefined = parseInt($page.url.searchParams.get("page"))
	let pageLimitParam: number | undefined = parseInt($page.url.searchParams.get("pageLimit"))

	// RESULTS
	let response: AxiosResponse | undefined | void // TODO
	let searchTimeoutId: NodeJS.Timeout | undefined

	// PERMISSIONS
	const canCreateResource: boolean = hasAdminPermission({
		adminPermissions: $page.data.adminPermissions,
		action: "POST",
		resources: [resource]
	})
	const canViewResource: boolean = hasAdminPermission({
		adminPermissions: $page.data.adminPermissions,
		action: "GET",
		resources: [resource]
	})
	const canEditResource: boolean = hasAdminPermission({
		adminPermissions: $page.data.adminPermissions,
		action: "PUT",
		resources: [resource]
	})
	const canDeleteResource: boolean = hasAdminPermission({
		adminPermissions: $page.data.adminPermissions,
		action: "DELETE",
		resources: [resource]
	})

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
		let paramString = ""
		if (!!searchParam) paramString += `search=${searchParam}&`
		if (!!orderByParam) paramString += `orderBy=${orderByParam}&`
		if (!!pageParam) paramString += `page=${pageParam}&`
		if (!!pageLimitParam) paramString += `pageLimit=${pageLimitParam}&`
		goto(`${$page.url.pathname}${!!paramString ? `?${paramString.slice(0, -1)}` : ""}`, {
			replaceState: false
		})
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
			.catch(async (error) => {
				errorLoading = true
				toastStore.trigger(
					new Toast({
						message: "Failed to load results.",
						style: "error"
					})
				)
				if (error.response.status === 403) {
					await invalidateAll()
				}
				return undefined
			})
		updateUrlParams()
	}

	////
	// HANDLERS
	////

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
		const resourceId = getResourceId(event.detail)
		goto(`/admin/${resource}/${resourceId}`)
	}

	async function handleEditResult(event: CustomEvent<Result<any>>): Promise<void> {
		const resourceId = getResourceId(event.detail)
		goto(`/admin/${resource}/${resourceId}/edit`)
	}

	async function handleDeleteResult(event: CustomEvent<Result<any>>): Promise<void> {
		const resourceId = getResourceId(event.detail)
		modalStore.trigger({
			type: "confirm",
			title: `Delete ${plural(humanizeString(resource))}`,
			body: `Are you sure you want to delete this ${plural(humanizeString(resource))}?`,
			response: (r) => {
				if (r) {
					axios
						.delete(`/api/admin/${resource}/${resourceId}`)
						.then((response: AxiosResponse) => {
							toastStore.trigger(
								new Toast({
									message: `${plural(humanizeString(resource))} deleted successfully`,
									style: "success"
								})
							)
							loadResults()
						})
						.catch(async (error: any) => {
							toastStore.trigger(
								new Toast({
									message: `Error deleting ${plural(humanizeString(resource))}`,
									style: "error"
								})
							)
							if (error.response.status === 403) {
								await invalidateAll()
							}
							loadResults()
						})
				}
			}
		})
	}

	async function handleCreateResource(): Promise<void> {
		goto(`/admin/${resource}/create`, { replaceState: true })
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
	<div slot="title" class="capitalize">
		<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
		{plural(humanizeString(resource))}
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
		{#if canCreateResource}
			<button class="btn variant-filled-secondary" on:click={handleCreateResource}>
				<Icon icon="mdi:plus" class="mr-2" />
				New
			</button>
		{/if}
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
	<Loading />
{/if}
