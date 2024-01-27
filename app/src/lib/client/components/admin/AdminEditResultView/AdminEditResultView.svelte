<script lang="ts">
	import { AdminHeader, Loading } from "$components"
	import Icon from "@iconify/svelte"
	import axios, { type AxiosResponse } from "axios"
	// import { type SvelteComponent, onMount } from "svelte"
	import { Tab, TabGroup, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast, handleClientError, handleException, handleServerError } from "$client/utils"
	import { page } from "$app/stores"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto, invalidateAll } from "$app/navigation"
	import { onMount } from "svelte"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"

	const toastStore = getToastStore()

	////
	// VARIABLE PROPS
	////

	export let resource: string
	export let naturalKey: string | undefined
	export let primaryKey = "id"
	export let tabs: AdminEditResultViewTabs
	export let resourceApi: ResourceApi

	////
	// TABS
	////

	let currentTab = "default"
	const openedTabs = []
	$: {
		if (!openedTabs.includes(currentTab)) {
			openedTabs.push(currentTab) 
			loadTab(currentTab)
		}
	}

	async function loadTab(tab) {
		tabs[tab].isLoaded = false
		if (tabs[tab].getExtras !== undefined) {
			tabs[tab].extras = {...tabs[tab].extras, ...(await tabs[tab].getExtras())}
		}
		if (tabs[tab].submitted === undefined) {
			tabs[tab].submitted = false
		}
		if (tabs[tab].extras === undefined) {
			tabs[tab].extras = {}
		}
		tabs[tab].isLoaded = true
	}

	////
	// RESULT
	////

	let result: Record<string, any>
	$: resultId = result ? result[primaryKey] : undefined

	function onCancel() {
		// If history, go back, else go to /admin
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function onSubmit(e?: Event) {
		tabs[currentTab].onSubmit({ data: tabs[currentTab].data })
			.Success(async () => {
				toastStore.trigger(
					new Toast({
						message: `${pluralize.singular(humanizeString(resource))} updated successfully.`,
						style: "success"
					})
				)
				await getResult()
			})
			.ClientError(handleClientError({ toastStore}))
			.ServerError(handleServerError({ toastStore }))
	}

	////
	// FUNCTIONS
	////

	async function getResult() {
		resourceApi.resourceId$($page.params.resourceId).GET({})
			.Success(async (res) => {
				result = res.body
			})
			.ClientError(handleClientError({ toastStore}))
			.ServerError(handleServerError({ toastStore }))
	}

	onMount(async () => {
		await getResult()
	})
</script>

<AdminHeader>
	<svelte:fragment slot="title">
		<Icon icon="mdi:pencil" class="mr-2 mb-1 w-auto inline" />
		Edit {pluralize.singular(humanizeString(resource))}{naturalKey && result ? `: ${result[naturalKey]}` : ""}
	</svelte:fragment>

	<div class="flex justify-between" slot="controls">
		<a href="/admin/{resource}/{resultId}" class="btn variant-filled-surface capitalize">
			<Icon icon="bx:detail" class="mr-2" />
			View
		</a>
		<button
			type="button"
			class="btn variant-filled-success capitalize"
			on:click={onSubmit}
			disabled={!tabs[currentTab].canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Update {currentTab !== "default"
				? humanizeString(currentTab)
				: pluralize.singular(humanizeString(resource))}
		</button>
	</div>
</AdminHeader>

<!-- Display help text -->
{#if $$slots.help}
	<div class="card variant-soft p-4 m-0 mb-4">
		<Accordion>
			<AccordionItem title="Help">
				<svelte:fragment slot="lead">
					<!-- Help Icon -->
					<Icon icon="mdi:help-circle-outline" class="mr-2 mb-1 w-auto inline" />
				</svelte:fragment>
				<svelte:fragment slot="summary">
					About editing a {pluralize.singular(resource)}
				</svelte:fragment>
				<svelte:fragment slot="content">
					<slot name="help" />
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
{/if}

<div class="card variant-soft p-4 mb-4">
	{#if Object.keys(tabs).length > 1}
		<TabGroup class="mb-4 capitalize">
			{#each Object.keys(tabs) as tab}
				<Tab
					bind:group={currentTab}
					name={tab !== "default" ? humanizeString(tab) : pluralize.singular(humanizeString(resource))}
					value={tab}
				>
					<span>{tab !== "default" ? humanizeString(tab) : pluralize.singular(humanizeString(resource))}</span
					>
				</Tab>
			{/each}
		</TabGroup>
	{/if}
	<!-- RENDER TABS -->
	{#each Object.keys(tabs) as tab}
		<!-- Only render tab if it's open or has been opened to preserve state -->
		{#if result && (currentTab === tab || openedTabs.includes(tab))}
			<!-- Hide opened tabs that are not currently open -->
			<div class:hidden={currentTab !== tab}>
				<!-- Show loading if formExtras is not loaded -->
				{#if !tabs[tab].isLoaded}
					<Loading />
				{:else}
					<!-- Show form if tab is populated -->
					<svelte:component
						this={tabs[tab].FormComponent}
						bind:data={tabs[tab].data}
						bind:errors={tabs[tab].errors}
						bind:canSubmit={tabs[tab].canSubmit}
						bind:disabled={tabs[tab].disabled}
						on:submit={onSubmit}
						on:cancel={onCancel}
						{...tabs[tab].extras}
						{result}
					/>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<AdminHeader>
	<div class="flex justify-between" slot="controls">
		<button type="button" class="btn variant-filled-surface capitalize" on:click={onCancel}>
			<Icon icon="material-symbols:cancel-outline" class="mr-2" />
			Cancel
		</button>
		<button
			type="button"
			class="btn variant-filled-success capitalize"
			on:click={onSubmit}
			disabled={!tabs[currentTab].canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Update {currentTab !== "default"
				? humanizeString(currentTab)
				: pluralize.singular(humanizeString(resource))}
		</button>
	</div>
</AdminHeader>
