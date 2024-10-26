<script lang="ts">
	import { AdminResultsTable, Pagination, AdminHeader, Loading } from "$client/components"
	import Icon from "@iconify/svelte"
	import { getModalStore } from "@skeletonlabs/skeleton"
	import { onMount, setContext } from "svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast, handleServerError, hasAdminPermission } from "$client/utils"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"

	setContext("page", page)

	const toastStore = getToastStore()
	const modalStore = getModalStore()

	////
	// VARIABLE PROPS
	
	interface Props {
		////
		dataHandlers?: {
		[key: string]: {
			header?: string
			handler?: (result: Result<any>) => any
			orderByKey?: string
			getUrl?: (result: Result<any>) => string
		}
	};
		orderedKeys?: string[];
		excludeKeys?: string[];
		getResourceId?: (result: Result<any>) => string;
		resource: string;
		resourceApi: ResourceApi;
	}

	let {
		dataHandlers = {},
		orderedKeys = [],
		excludeKeys = [],
		getResourceId = (result: Result<any>) => result.id,
		resource,
		resourceApi
	}: Props = $props();

	////
	// INTERNAL VARIABLES
	////

	let errorLoading = $state(false)

	// SEARCH PARAMS
	let searchParam: string = $state($page.url.searchParams.get("search") || "")
	let orderByParam: string | undefined = $page.url.searchParams.get("orderBy")
	let pageParam: number | undefined = parseInt($page.url.searchParams.get("page"))
	let pageLimitParam: number | undefined = parseInt($page.url.searchParams.get("pageLimit"))

	// RESULTS
	let response: undefined | void | Response & {
		body: {
			success: boolean,
			results: Result<any>[],
			resultCount: number,
			resultStart: number,
			resultEnd: number,
			totalCount: number,
			pageLimit: number,
			previousPage: number | null,
			currentPage: number,
			nextPage: number | null,
			pageCount: number,
			orderBy: string,
			search?: string,
		}
	} = $state()
	let searchTimeoutId: NodeJS.Timeout | undefined

	// PERMISSIONS
	const canCreateResource: boolean = hasAdminPermission({
		user: $page.data.user,
		adminPermissions: $page.data.adminPermissions,
		action: "POST",
		resources: [resource]
	})
	const canViewResource: boolean = hasAdminPermission({
		user: $page.data.user,
		adminPermissions: $page.data.adminPermissions,
		action: "GET",
		resources: [resource]
	})
	const canEditResource: boolean = hasAdminPermission({
		user: $page.data.user,
		adminPermissions: $page.data.adminPermissions,
		action: "PUT",
		resources: [resource]
	})
	const canDeleteResource: boolean = hasAdminPermission({
		user: $page.data.user,
		adminPermissions: $page.data.adminPermissions,
		action: "DELETE",
		resources: [resource]
	})

	////
	// FUNCTIONS
	////

	function updateUrlParams(): void {
		if (!!response) {
			searchParam = response.body.search
			orderByParam = response.body.orderBy
			pageParam = response.body.currentPage
			pageLimitParam = response.body.pageLimit
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
		const query: {
				search?: string,
				orderBy?: string,
				page?: number,
				pageLimit?: number,
			} = {}

			if (searchParam) query.search = searchParam
			if (orderByParam) query.orderBy = orderByParam
			if (pageParam) query.page = pageParam
			if (pageLimitParam) query.pageLimit = pageLimitParam

		await resourceApi.GET({
			query
		}).Success((r: Response) => {
			response = r as any // TODO: Fix types
		})
		.ServerError((r: Response) => {
			errorLoading = true
			handleServerError({toastStore})
			return undefined
		})

		updateUrlParams()
	}

	////
	// HANDLERS
	////

	async function onOrderByChange(value: string): Promise<void> {
		orderByParam = value
		await loadResults()
	}

	async function onPageChange(value: number): Promise<void> {
		pageParam = value
		await loadResults()
	}

	async function onPageLimitChange(value: number): Promise<void> {
		pageLimitParam = value
		await loadResults()
	}

	async function onView(event: CustomEvent<Result<any>>): Promise<void> {
		const resourceId = getResourceId(event.detail)
		goto(`/admin/${resource}/${resourceId}`)
	}

	async function onEdit(event: CustomEvent<Result<any>>): Promise<void> {
		const resourceId = getResourceId(event.detail)
		goto(`/admin/${resource}/${resourceId}/edit`)
	}

	async function onDelete(event: CustomEvent<Result<any>>): Promise<void> {
		const resourceId = getResourceId(event.detail)
		modalStore.trigger({
			type: "confirm",
			title: `Delete ${pluralize.plural(humanizeString(resource))}`,
			body: `Are you sure you want to delete this ${pluralize.singular(humanizeString(resource))}?`,
			response: async (r) => {
				if (r) {
					await resourceApi.resourceId$(resourceId).DELETE({}).Success((r: Response) => {
						toastStore.trigger(
							new Toast({
								message: `${pluralize.singular(humanizeString(resource))} deleted successfully`,
								style: "success"
							})
						)
						loadResults()
					}).ClientError((r: Response) => {
						toastStore.trigger(
							new Toast({
								message: `Error deleting ${pluralize.singular(humanizeString(resource))}`,
								style: "error"
							})
						)
					}).ServerError((r: Response) => {
						toastStore.trigger(
							new Toast({
								message: `Error deleting ${pluralize.singular(humanizeString(resource))}`,
								style: "error"
							})
						)
					})
				}
				loadResults()
			}
		})
	}

	async function onCreate(): Promise<void> {
		goto(`/admin/${resource}/create`, { replaceState: true })
	}

	async function onSearchStringChange(event: Event): Promise<void> {
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
	{#snippet title()}
		<div  class="capitalize">
			<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
			{pluralize.plural(humanizeString(resource))}
		</div>
	{/snippet}

	{#snippet controls()}
		<div class="flex justify-between" >
			<div>
				<input
					class="input w-auto"
					type="text"
					placeholder="Search"
					bind:value={searchParam}
					oninput={onSearchStringChange}
				/>
				<button
					class="btn variant-filled"
					disabled={!searchParam}
					onclick={() => {
					searchParam = ""
					loadResults()
				}}
				>
					Reset
				</button>
			</div>
			{#if canCreateResource}
				<button class="btn variant-filled-secondary" onclick={onCreate}>
					<Icon icon="mdi:plus" class="mr-2" />
					New
				</button>
			{/if}
		</div>
	{/snippet}
</AdminHeader>

<!-- RESULTS TABLE -->
{#if response && response.body && response.body}
	<AdminResultsTable
		{...response.body}
		{dataHandlers}
		{orderedKeys}
		{excludeKeys}
		{canViewResource}
		{canEditResource}
		{canDeleteResource}
		on:orderByChange={(orderBy) => onOrderByChange(orderBy)}
		on:viewResult={onView}
		on:editResult={onEdit}
		on:deleteResult={onDelete}
	/>
	{#if response && response.body && response.body.results.length}
		<AdminHeader>
			{#snippet controls()}
					
					<Pagination
						{...response.body}
						{onPageLimitChange}
						{onPageChange}
					/>
				
					{/snippet}
		</AdminHeader>
	{/if}
{:else if errorLoading}
	<div class="flex items-center justify-center mb-2">
		<Icon icon="mdi:alert-circle-outline" class="mr-2" />
		Failed to load results.
		<br />
	</div>
	<div class="flex items-center justify-center">
		<button class="btn variant-filled" onclick={loadResults}>
			<Icon icon="mdi:reload" class="mr-2" />
			Retry
		</button>
	</div>
{:else}
	<Loading />
{/if}
