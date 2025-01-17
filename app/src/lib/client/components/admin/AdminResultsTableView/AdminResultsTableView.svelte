<script lang="ts">
	import { AdminResultsTable, Pagination, AdminHeader, Loading } from "$client/components"
	import { type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import { getContext, onMount, setContext, type Snippet } from "svelte"
	import { handleServerError, hasAdminPermission } from "$client/utils"
	import { page } from "$app/state"
	import { goto } from "$app/navigation"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"
	import * as Icon from "lucide-svelte"

	setContext("page", page)

	const toast: ToastContext = getContext("toast")

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
		showCreateButton?: boolean;
		showDeleteButton?: boolean;
		extraHeaderControls?: Snippet
	}

	let {
		dataHandlers = {},
		orderedKeys = [],
		excludeKeys = [],
		getResourceId = (result: Result<any>) => result.id,
		resource,
		resourceApi,
		showCreateButton = true,
		showDeleteButton = true,
		extraHeaderControls
	}: Props = $props();

	////
	// INTERNAL VARIABLES
	////

	let errorLoading = $state(false)

	// SEARCH PARAMS
	let searchParam: string = $state(page.url.searchParams.get("search") || "")
	let orderByParam: string | undefined = page.url.searchParams.get("orderBy")
	let pageParam: number | undefined = parseInt(page.url.searchParams.get("page"))
	let pageLimitParam: number | undefined = parseInt(page.url.searchParams.get("pageLimit"))

	// RESULTS
	let response: Response & {
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
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "POST",
		resources: [resource]
	}) && showCreateButton
	const canViewResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "GET",
		resources: [resource]
	})
	const canEditResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "PUT",
		resources: [resource]
	})
	const canDeleteResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "DELETE",
		resources: [resource]
	}) && showDeleteButton

	////
	// FUNCTIONS
	////

	function updateUrlParams(): void {
		if (response) {
			searchParam = response.body.search
			orderByParam = response.body.orderBy
			pageParam = response.body.currentPage
			pageLimitParam = response.body.pageLimit
		}
		let paramString = ""
		if (searchParam) paramString += `search=${searchParam}&`
		if (orderByParam) paramString += `orderBy=${orderByParam}&`
		if (pageParam) paramString += `page=${pageParam}&`
		if (pageLimitParam) paramString += `pageLimit=${pageLimitParam}&`
		goto(`${page.url.pathname}${paramString ? `?${paramString.slice(0, -1)}` : ""}`, {
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
			handleServerError({toast})
			return undefined
		})

		updateUrlParams()
	}

	////
	// HANDLERS
	////

	async function onOrderByChange(value: string): Promise<void> {
		console.log("onOrderByChange", value)
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

	async function onView(result: any): Promise<void> {
		const resourceId = getResourceId(result)
		goto(`/admin/${resource}/${resourceId}`)
	}

	async function onEdit(result: any): Promise<void> {
		const resourceId = getResourceId(result)
		goto(`/admin/${resource}/${resourceId}/edit`)
	}

	let isDeleteModalOpen = $state(false)
	let deleteModalData: any = $state({})

	async function onDelete(result: any): Promise<void> {
		deleteModalData = { result }
		isDeleteModalOpen = true
	}

	async function onDeleteCancel(): Promise<void> {
		isDeleteModalOpen = false
		deleteModalData = {}
	}

	async function onDeleteConfirm({result}): Promise<void> {
		const resourceId = getResourceId(result)
		await resourceApi.resourceId$(resourceId).DELETE({}).Success((r: Response) => {
				toast.create({
					description: `${pluralize.singular(humanizeString(resource))} deleted successfully`,
					type: "success"
				})
				loadResults()
			}).ClientError((r: Response) => {
				toast.create({
					description: `Error deleting ${pluralize.singular(humanizeString(resource))}`,
					type: "error"
				})
			}).ServerError((r: Response) => {
				toast.create({
					description: `Error deleting ${pluralize.singular(humanizeString(resource))}`,
					type: "error"
				})
			})
		loadResults()
		deleteModalData = {}
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
		<div class="capitalize">
			<Icon.Table class="mb-1 w-auto inline" />
			{pluralize.plural(humanizeString(resource))}
		</div>
	{/snippet}

	{#snippet controls()}
		<div class="flex justify-between" >
			<div class="flex gap-2">
				<input
					class="input w-auto pl-1"
					type="text"
					placeholder="Search"
					bind:value={searchParam}
					oninput={onSearchStringChange}
				/>
				<button
					class="btn preset-filled-surface-500"
					disabled={!searchParam}
					onclick={() => {
					searchParam = ""
					loadResults()
				}}
				>
					Reset
				</button>
			</div>
			<div>
				{@render extraHeaderControls?.()}
				{#if canCreateResource}
					<button class="btn preset-filled-secondary-500" onclick={onCreate}>
						<Icon.Plus />
						New
					</button>
				{/if}
			</div>
		</div>
	{/snippet}
</AdminHeader>

<!-- RESULTS TABLE -->
{#if response && response.body && response.body}
	<AdminResultsTable
		{resource}
		{...response.body}
		{dataHandlers}
		{orderedKeys}
		{excludeKeys}
		{canViewResource}
		{canEditResource}
		{canDeleteResource}
		{onOrderByChange}
		{onView}
		{onEdit}
		{onDelete}
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
		<Icon.AlertCircle />
		Failed to load results.
		<br />
	</div>
	<div class="flex items-center justify-center">
		<button class="btn preset-filled" onclick={loadResults}>
			<Icon.RefreshCw />
			Retry
		</button>
	</div>
{:else}
	<Loading />
{/if}
