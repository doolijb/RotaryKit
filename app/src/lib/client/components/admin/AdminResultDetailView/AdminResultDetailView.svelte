<script lang="ts">
	import { 
		AdminHeader, 
		DetailGridItem, 
		Loading, 
		TextCell, 
		AdminImageResultDetails, 
		AdminVideoResultDetails ,
		ConfirmationModal,
	} from "$client/components" 
	import Icon from "@iconify/svelte"
	import { Tabs, type ToastContext } from "@skeletonlabs/skeleton-svelte"
	import { handleClientError, handleServerError, hasAdminPermission } from "$client/utils"
	import { page } from "$app/state"
	import BoolCell from "../../tableCells/BoolCell/BoolCell.svelte"
	import { getContext, onMount } from "svelte"
	import { goto } from "$app/navigation"
	import pluralize from "pluralize"
	import humanizeString from "humanize-string"

	const toast: ToastContext = getContext("toast")

	type DataType = "string" | "number" | "boolean" | "html"

	type DataHandler = {
		header?: string
		handler?: (result: Result<any>) => string | boolean | number
		orderByKey?: string
		getUrl?: (result: Result<any>) => string
		defer?: string
		dataType?: DataType
		tabType?: "default" | "image" | "video" | "array"
	}

	////
	// VARIABLE PROPS
	////

	interface Props {
		// Props
		resource: string;
		resourceApi: ResourceApi;
		dataHandlers?: DataHandlers;
		naturalKey: string;
		resourceId: string;
		showCreateButton: boolean;
		showEditButton: boolean;
		showDeleteButton: boolean;

		// Functions
		mutateResult?: (result: Result<any>) => Result<any> | undefined;
	}

	let {
		// Props
		resource,
		resourceApi,
		dataHandlers = {},
		naturalKey,
		resourceId,
		showCreateButton = true,
		showEditButton = true,
		showDeleteButton = true,

		// Functions
		mutateResult = undefined
	}: Props = $props();


	////
	// PERMISSIONS
	////

	const canEditResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "PUT",
		resources: [resource]
	}) && showEditButton

	const canDeleteResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "DELETE",
		resources: [resource]
	}) && showDeleteButton

	const canCreateResource: boolean = hasAdminPermission({
		user: page.data.user,
		adminPermissions: page.data.adminPermissions,
		action: "POST",
		resources: [resource]
	}) && showCreateButton

	let isDeleteModalOpen = $state(false)

	async function handleDelete() {
		isDeleteModalOpen = true
	}

	function onDeleteModalClose() {
		isDeleteModalOpen = false
	}

	async function onDeleteModalConfirm() {
		resourceApi.resourceId$(resourceId).DELETE({})
			.Success((r) => {
				toast.create({
					description: `${pluralize.singular(humanizeString(resource))} deleted successfully`,
					type: "success"
				})
				goto(`/admin/${resource}`)
			})
			.ClientError(handleClientError({ toast }))
			.ServerError(handleServerError({ toast }))
	}

	////
	// RESULT
	////

	let result: Record<string, any> = $state()

	async function getResult() {
		await resourceApi.resourceId$(resourceId).GET({})
			.Success((r) => {
				result = mutateResult ? mutateResult(r.body) : r.body
			})
			.ClientError(handleClientError({ toast }))
			.ServerError(handleServerError({ toast }))
	}

	////
	// TABS
	////

	const tabs = $state({
		default: {}
	})

	function buildTabs() {
		Object.entries(result).forEach(([key, value]) => {
			if (value instanceof Object) {
				tabs[key] = value
			} else {
				tabs.default[key] = value
			}
		})
	}

	let currentTab: string = $state()

	////
	// DATA HANDLERS
	////

	function getDataHandler(key: string): DataHandler | undefined {
		// If default, then we want the root dataHandlers
		if (currentTab === "default") return dataHandlers[key]
		// Otherwise, we want the nested dataHandler(s)
		return dataHandlers[currentTab]?.[key]
	}

	function getTabType(key:string) {
		const dataHandler = key === "default" ? dataHandlers : dataHandlers[key]
		if (dataHandler) {
			const type = dataHandler.tabType

			if (type) return type
		}

		if (result && key && ("smallWebpPath" in tabs[key])) {
			return "image"
		} else if (result && key && Array.isArray(tabs[key])) {
			return "array"
		}

		return "default"
	}

	function getValue(
		result: Result<any>,
		key: string,
	): any {
		const dataHandler = getDataHandler(key)
		const value = result[key]
		const handler = dataHandler && dataHandler[key] ? dataHandler[key].handler : undefined
		const retVal = handler ? handler(value) : value
		return ![undefined, null].includes(retVal) ? retVal : ""
	}

	function getHeader(key: string): string {
		const dataHandler = getDataHandler(key)
		return dataHandler ? dataHandler.header || humanizeString(key) : humanizeString(key)
	}

	function getDataType(key: string) {
		const dataHandler = getDataHandler(key)
		let type = dataHandler ? dataHandler.dataType : undefined
		return type
	}

	////
	// LIFECYCLE
	////

	onMount(async () => {
		// If there is a tab query param, then we want to set the currentTab to that
		await getResult()
		buildTabs()
		currentTab = page.url.searchParams.get("tab") || "default"
	})
	////
	// INTERNAL VARIABLES
	////

	let isLoaded = $derived(!!result && !!currentTab)
</script>

{#snippet noResults()}
	<div class="text-center">
		<p>No results found</p>
	</div>
{/snippet}

<ConfirmationModal
	openState={isDeleteModalOpen}
	onCancel={onDeleteModalClose}
	onConfirm={onDeleteModalConfirm}
	title={`Delete ${pluralize.singular(humanizeString(resource))}`}
	body={`Are you sure you want to delete this ${pluralize.singular(humanizeString(resource))}?`}
/>

<AdminHeader>
	{#snippet title()}
	
			<Icon icon="bx:detail" class="mr-1 mb-1 w-auto inline" />
			Viewing {pluralize.singular(humanizeString(resource))}{isLoaded && result[naturalKey]
				? `: ${result[naturalKey]}`
				: ""}
		
	{/snippet}
	{#snippet controls()}
		<div class="flex justify-between" >
			<a href="/admin/{resource}" class="btn preset-filled-surface-500">
				<Icon icon="material-symbols:list" class="mr-1" />
				View All
			</a>
			{#if canCreateResource}
				<a
					href="/admin/{resource}/create"
					class="btn preset-filled-success-500"
					class:disabled={!isLoaded}
				>
					<Icon icon="mdi:plus" class="mr-1" />
					New
				</a>
			{/if}
		</div>
	{/snippet}
</AdminHeader>

{#if isLoaded}
	<section class="card preset-tonal p-4 mb-4">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<Tabs bind:value={currentTab}>
			{#snippet list()}
				{#each Object.keys(tabs) as key}
					<Tabs.Control value={key}>
						<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
						<span
							>{humanizeString(
								key === "default" ? pluralize.singular(humanizeString(resource)) : humanizeString(key)
							)}</span
						>
					</Tabs.Control>
				{/each}
			{/snippet}
			<!-- Tab Panels --->
			{#snippet content()}
				{#each Object.keys(tabs) as key}
					<Tabs.Panel value={key}>
						{@const tabType = getTabType(key)}
							<!-- If array of items, display a table -->
							{#if tabType === "array"}
								{#if tabs[key].length === 0}
									{@render noResults()}
								{:else}
								<!-- Display a table -->
									<div class="table-container">
										<table class="table w-full m-0 preset-soft">
											<thead>
												<tr>
													{#each Object.keys(tabs[key][0]) as key}
														<th>{getHeader(key)}</th>
													{/each}
												</tr>
											</thead>
											<tbody>
												{#each tabs[key] as result}
													<tr>
														{#each Object.keys(result) as key}
															{#if typeof getValue(result, key,) === "boolean"}
																<BoolCell value={getValue(result, key)} />
															{:else}
																<TextCell text={`${getValue(result, key)}`} />
															{/if}
														{/each}
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								{/if}
							<!-- If object -->
							{:else if Object.keys(tabs[key] || {}).length === 0}
								{@render noResults()}

							{:else if tabType === "image"}
								<AdminImageResultDetails result={tabs[key]} />
							{:else if tabType === "video"}
								<AdminVideoResultDetails result={tabs[key]} />
							{:else if tabType === "default"}
								<!-- If object, display a grid of details -->
								<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-min">
									{#each Object.keys(tabs[key]) as subkey}
										{@const dataType = getDataType(subkey)}
										<DetailGridItem label={key} value={getValue(tabs[key], subkey)} {dataType}  />
									{/each}
								</div>
							{/if}
						</Tabs.Panel>		
					{/each}
				{/snippet}
		</Tabs>
	</section>
{:else}
	<Loading />
{/if}

{#if canDeleteResource || canEditResource}
	<AdminHeader>
		{#snippet controls()}
				<div class="flex justify-between" >
				{#if canDeleteResource}
					<button
						type="button"
						class="btn preset-filled-error-500"
						onclick={handleDelete}
						disabled={!isLoaded}
					>
						<Icon icon="mdi:trash-can" class="mr-1" />
						Delete
					</button>
				{/if}
				{#if canEditResource}
					<a
						href="{page.url.pathname}/edit"
						class="btn preset-filled-primary-500"
						class:disabled={!isLoaded}
					>
						<Icon icon="mdi:pencil" class="mr-1" />
						Edit
					</a>
				{/if}
			</div>
			{/snippet}
	</AdminHeader>
{/if}
