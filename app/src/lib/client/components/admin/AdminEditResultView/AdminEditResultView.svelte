<script lang="ts">
	import { AdminHeader, Loading } from "$client/components"
	import Icon from "@iconify/svelte"
	import { Tab, TabGroup, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast, handleClientError, handleServerError } from "$client/utils"
	import { page } from "$app/stores"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto } from "$app/navigation"
	import { onMount } from "svelte"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"
	import type { Snippet } from "svelte"

	const toastStore = getToastStore()

	////
	// PROPS
	////
	
	interface Props {
		// Props
		resource: string
		naturalKey?: string
		primaryKey?: string
		resourceApi: ResourceApi

		// Bindables
		tabs: Record<string, any>

		// Snippets
		helpSnippet?: Snippet
	}

	let {
		// Props
		resource,
		naturalKey,
		primaryKey = "id",
		resourceApi,

		// Bindables
		tabs = $bindable({}),

		// Snippets
		helpSnippet
	}: Props = $props();

	////
	// CONSTANTS
	////

	const openedTabs = []

	////
	// STATE
	////

	let currentTab = $state("default")
	let result: Record<string, any> = $state()

	////
	// FUNCTIONS
	////

	async function loadTab(tab) {
		tabs[tab].isLoaded = false
		if (tabs[tab].getExtras !== undefined) {
			tabs[tab].extras = {...tabs[tab].extras, ...(await tabs[tab].getExtras())}
		}
		tabs[tab].submitted = tabs[tab].submitted || false
		tabs[tab].extras = tabs[tab].extras || {}
		tabs[tab].isLoaded = true
		tabs[tab].data = tabs[tab].data || {} as FormDataOf<any>
		tabs[tab].errors = tabs[tab].errors || {} as FormErrors
		tabs[tab].disabled = tabs[tab].disabled || false
		tabs[tab].canSubmit = tabs[tab].canSubmit || true
	}

	async function getResult() {
		resourceApi.resourceId$($page.params.resourceId).GET({})
			.Success(async (res) => {
				result = res.body
			})
			.ClientError(handleClientError({ toastStore}))
			.ServerError(handleServerError({ toastStore }))
	}

	function oncancel() {
		// If history, go back, else go to /admin
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function onsubmit(e?: Event) {
		tabs[currentTab].onsubmit({ data: tabs[currentTab].data })
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
	// CALCULATED
	////

	$effect.pre(() => {
		if (!openedTabs.includes(currentTab)) {
			openedTabs.push(currentTab) 
			loadTab(currentTab)
		}
	});

	let resultId = $derived(result ? result[primaryKey] : undefined)

	////
	// LIFECYCLE
	////

	onMount(async () => {
		await getResult()
	})

</script>

{#snippet updateButton(canSubmit)}
	<button
	type="button"
	class="btn variant-filled-success capitalize"
	onclick={onsubmit}
	disabled={canSubmit}
	>
	<Icon icon="mdi:floppy" class="mr-2" />
	Update {currentTab !== "default"
		? humanizeString(currentTab)
		: pluralize.singular(humanizeString(resource))}
	</button>
{/snippet}

<AdminHeader>
	{#snippet title()}
	
			<Icon icon="mdi:pencil" class="mr-2 mb-1 w-auto inline" />
			Edit {pluralize.singular(humanizeString(resource))}{naturalKey && result ? `: ${result[naturalKey]}` : ""}
		
	{/snippet}

	{#snippet controls()}
		<div class="flex justify-between" >
			<a href="/admin/{resource}/{resultId}" class="btn variant-filled-surface capitalize">
				<Icon icon="bx:detail" class="mr-2" />
				View
			</a>
			{@render updateButton(!tabs[currentTab].canSubmit)}
		</div>
	{/snippet}
</AdminHeader>

<!-- Display help text -->
{#if helpSnippet}
	<div class="card variant-soft p-4 m-0 mb-4">
		<Accordion>
			<AccordionItem title="Help">
				<!-- Help Icon -->
				<Icon icon="mdi:help-circle-outline" class="mr-2 mb-1 w-auto inline" />
					
				About editing a {pluralize.singular(resource)}
					
				{@render helpSnippet()}
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
					{@const FormComponent = tabs[tab].FormComponent}
					<FormComponent
						bind:data={tabs[tab].data}
						bind:errors={tabs[tab].errors}
						bind:canSubmit={tabs[tab].canSubmit}
						bind:disabled={tabs[tab].disabled}
						{onsubmit}
						{oncancel}
						{...tabs[tab].extras}
						{result}
					/>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<AdminHeader>
	{#snippet controls()}
		<div class="flex justify-between" >
			<button type="button" class="btn variant-filled-surface capitalize" onclick={oncancel}>
				<Icon icon="material-symbols:cancel-outline" class="mr-2" />
				Cancel
			</button>
			{@render updateButton(!tabs[currentTab].canSubmit)}
		</div>
	{/snippet}
</AdminHeader>
