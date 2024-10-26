<script lang="ts">
	import { AdminHeader, DetailGridItem, Loading, TextCell, AdminImageResultDetails } from "$client/components" 
	import Icon from "@iconify/svelte"
	import { Tab, TabGroup, getModalStore, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast, handleClientError, handleServerError, hasAdminPermission } from "$client/utils"
	import { page } from "$app/stores"
	import BoolCell from "../../tableCells/BoolCell/BoolCell.svelte"
	import { onMount } from "svelte"
	import { goto } from "$app/navigation"
	import pluralize from "pluralize"
	import humanizeString from "humanize-string"

	const toastStore = getToastStore()
	const modalStore = getModalStore()

	type DataHandler = {
		header?: string
		handler?: (result: Result<any>) => string | boolean | number
		orderByKey?: string
		getUrl?: (result: Result<any>) => string
		defer?: string
	}

	type DataHandlers = {
		[key: string]: DataHandler | DataHandlers
	}

	////
	// VARIABLE PROPS
	

	interface Props {
		////
		resource: string;
		resourceApi: ResourceApi;
		dataHandlerSet?: DataHandlers;
		naturalKey: string;
		resourceId: string;
		mutateResult?: (result: Result<any>) => Result<any> | undefined;
	}

	let {
		resource,
		resourceApi,
		dataHandlerSet = {},
		naturalKey,
		resourceId,
		mutateResult = undefined
	}: Props = $props();


	////
	// PERMISSIONS
	////

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

	const canCreateResource: boolean = hasAdminPermission({
		user: $page.data.user,
		adminPermissions: $page.data.adminPermissions,
		action: "POST",
		resources: [resource]
	})

	async function handleDelete() {
		modalStore.trigger({
			type: "confirm",
			title: `Delete ${pluralize.singular(humanizeString(resource))}`,
			body: `Are you sure you want to delete this ${pluralize.singular(humanizeString(resource))}?`,
			response: (r) => {
				if (r) {
					resourceApi.resourceId$(resourceId).DELETE({})
						.Success((r) => {
							toastStore.trigger(
								new Toast({
									message: `${pluralize.singular(humanizeString(resource))} deleted successfully`,
									style: "success"
								})
							)
							goto(`/admin/${resource}`)
						})
						.ClientError(handleClientError({ toastStore }))
						.ServerError(handleServerError({ toastStore }))
				}
			}
		})
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
			.ClientError(handleClientError({ toastStore }))
			.ServerError(handleServerError({ toastStore }))
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
		// If default, then we want the root dataHandlerSet
		if (currentTab === "default") return dataHandlerSet[key]
		// Otherwise, we want the nested dataHandler(s)
		return dataHandlerSet[currentTab]?.[key]
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

	////
	// LIFECYCLE
	////

	onMount(async () => {
		// If there is a tab query param, then we want to set the currentTab to that
		await getResult()
		buildTabs()
		currentTab = $page.url.searchParams.get("tab") || "default"
	})
	////
	// INTERNAL VARIABLES
	////

	let isLoaded = $derived(!!result && !!currentTab)
	let isCurrentTabImage = $derived(result && currentTab && ("smallWebpPath" in tabs[currentTab]));
	let isCurrentTabArray = $derived(result && currentTab && Array.isArray(tabs[currentTab]))
</script>

<AdminHeader>
	{#snippet title()}
	
			<Icon icon="bx:detail" class="mr-2 mb-1 w-auto inline" />
			Viewing {pluralize.singular(humanizeString(resource))}{isLoaded && result[naturalKey]
				? `: ${result[naturalKey]}`
				: ""}
		
	{/snippet}
	{#snippet controls()}
		<div class="flex justify-between" >
			<a href="/admin/{resource}" class="btn variant-filled-surface">
				<Icon icon="material-symbols:list" class="mr-2" />
				View All
			</a>
			{#if canCreateResource}
				<a
					href="/admin/{resource}/create"
					class="btn variant-filled-success"
					class:disabled={!isLoaded}
				>
					<Icon icon="mdi:plus" class="mr-2" />
					New
				</a>
			{/if}
		</div>
	{/snippet}
</AdminHeader>

{#if isLoaded}
	<section class="card variant-soft p-4 mb-4">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<TabGroup>
			{#each Object.keys(tabs) as key}
				<Tab bind:group={currentTab} name={humanizeString(key)} value={key}>
					<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
					<span
						>{humanizeString(
							key === "default" ? pluralize.singular(humanizeString(resource)) : humanizeString(key)
						)}</span
					>
				</Tab>
			{/each}
			<!-- Tab Panels --->
			{#snippet panel()}
					
					<!-- If array of items, display a table -->
					{#if isCurrentTabArray}
						<!-- No results found -->
						{#if tabs[currentTab].length === 0}
							<p class="text-center">No results found.</p>
						{:else}
						<!-- Display a table -->
							<div class="table-container">
								<table class="table w-full m-0 variant-soft">
									<thead>
										<tr>
											{#each Object.keys(tabs[currentTab][0]) as key}
												<th>{getHeader(key)}</th>
											{/each}
										</tr>
									</thead>
									<tbody>
										{#each tabs[currentTab] as result}
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
					{:else if isCurrentTabImage}
						<AdminImageResultDetails result={tabs[currentTab]} />
					{:else}
						<!-- If object, display a grid of details -->
						<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							{#each Object.keys(tabs[currentTab]) as key}
								<DetailGridItem label={key} value={getValue(tabs[currentTab], key)} />
							{/each}
						</div>
					{/if}
				
					{/snippet}
		</TabGroup>
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
						class="btn variant-filled-error"
						onclick={handleDelete}
						disabled={!isLoaded}
					>
						<Icon icon="mdi:trash-can" class="mr-2" />
						Delete
					</button>
				{/if}
				{#if canEditResource}
					<a
						href="{$page.url.pathname}/edit"
						class="btn variant-filled-primary"
						class:disabled={!isLoaded}
					>
						<Icon icon="mdi:pencil" class="mr-2" />
						Edit
					</a>
				{/if}
			</div>
			{/snippet}
	</AdminHeader>
{/if}
