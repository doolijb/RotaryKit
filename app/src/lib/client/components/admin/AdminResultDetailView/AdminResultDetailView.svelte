<script lang="ts">
	import { AdminHeader, AdminResultsTableView, DetailGridItem, TextCell } from "@components"
	import Icon from "@iconify/svelte"
	import axios, { type AxiosResponse } from "axios"
	// import { type SvelteComponent, onMount } from "svelte"
	import { Tab, TabGroup, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "@utils"
	import { page } from "$app/stores"
	import humanizeString from "humanize-string"
	import boolean from "$lib/shared/validation/validators/boolean"
	import moment from "moment"
	import { clipboard } from "@skeletonlabs/skeleton"
	import BoolCell from "../../tableCells/BoolCell/BoolCell.svelte"
	import { onMount } from "svelte"

	const toastStore = getToastStore()

	type DataHandler = {
		header?: string
		handler?: (result: Result<any>) => string | boolean | number
		orderByKey?: string
		getUrl?: (result: Result<any>) => string
	}

	type DataHandlers = {
		[key: string]: DataHandler | DataHandlers
	}

	////
	// VARIABLE PROPS
	////
	export let resource: string
	export let displayTitle: string
	export let result: Record<string, any>
	export let dataHandlerSet: DataHandlers = {}
	export let naturalKey: string

	function handleCancel() {
		// TODO
	}

	async function handleEdit() {}

	////
	// TABS
	////

	const tabs = {
		default: {}
	}

	Object.entries(result).forEach(([key, value]) => {
		if (value instanceof Object) {
			tabs[key] = value
		} else {
			tabs.default[key] = value
		}
	})

	let currentTab: string = "default"

	/**
	 * When a tab is changed, we want to set the query prams to the tab.
	 * If the tab is the default tab, then we want to remove the query param.
	 */
	$: {
		if (currentTab === "default") {
			window.history.replaceState({}, "", $page.url.pathname)
		} else {
			window.history.replaceState({}, "", `${$page.url.pathname}?tab=${currentTab}`)
		}
	}

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
		dataHandler: DataHandler | DataHandlers | undefined
	): any {
		const value = result[key]
		const handler = !!dataHandler ? dataHandler[key]?.handler : undefined
		const retVal = !!handler ? handler(value) : value
		return ![undefined, null].includes(retVal) ? retVal : ""
	}

	function getHeader(key: string, dataHandler: DataHandler | DataHandlers | undefined): string {
		return dataHandler?.[key]?.header ?? humanizeString(key)
	}

	////
	// LIFECYCLE
	////

	onMount(() => {
		// If there is a tab query param, then we want to set the currentTab to that
		const tabParam = $page.url.searchParams.get("tab")
		if (!!tabParam) currentTab = tabParam
	})
</script>

<AdminHeader>
	<svelte:fragment slot="title">
		<Icon icon="bx:detail" class="mr-2 mb-1 w-auto inline" />
		Viewing {displayTitle}{result[naturalKey] ? `: ${result[naturalKey]}` : ""}
	</svelte:fragment>
	<div class="flex justify-between" slot="controls">
		<a href="/admin/{resource}" class="btn variant-filled-surface" on:click={handleCancel}>
			<Icon icon="material-symbols:list" class="mr-2" />
			View All
		</a>
		<a href="{$page.url.pathname}/edit" class="btn variant-filled-success" on:click={handleEdit}>
			<Icon icon="mdi:plus" class="mr-2" />
			New
		</a>
	</div>
</AdminHeader>

<section class="card variant-soft p-4 mb-4">
	<!-- Lets nicely lay out all the details of result -->
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<TabGroup>
		{#each Object.keys(tabs) as key}
			<Tab bind:group={currentTab} name={humanizeString(key)} value={key}>
				<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
				<span>{humanizeString(key === "default" ? displayTitle : key)}</span>
			</Tab>
		{/each}
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<!-- Display responsive grid for all details in the tabset -->
			{#if Array.isArray(tabs[currentTab])}
				<div class="table-container">
					<table class="table w-full m-0 variant-soft">
						<thead>
							<tr>
								{#each Object.keys(tabs[currentTab][0]) as key}
									<th>{getHeader(key, getDataHandler(key))}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each tabs[currentTab] as result}
								<tr>
									{#each Object.keys(result) as key}
										{#if typeof getValue(result, key, getDataHandler(key)) === "boolean"}
											<BoolCell value={getValue(result, key, getDataHandler(key))} />
										{:else}
											<TextCell text={`${getValue(result, key, getDataHandler(key))}`} />
										{/if}
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{#each Object.keys(tabs[currentTab]) as key}
						<DetailGridItem label={key} value={getValue(result, key, getDataHandler(key))} />
					{/each}
				</div>
			{/if}
		</svelte:fragment>
	</TabGroup>
</section>

<AdminHeader>
	<div class="flex justify-between" slot="controls">
		<button type="button" class="btn variant-filled-error" on:click={handleEdit}>
			<Icon icon="mdi:trash-can" class="mr-2" />
			Delete
		</button>
		<a href="{$page.url.pathname}/edit" class="btn variant-filled-primary" on:click={handleEdit}>
			<Icon icon="mdi:pencil" class="mr-2" />
			Edit
		</a>
	</div>
</AdminHeader>
