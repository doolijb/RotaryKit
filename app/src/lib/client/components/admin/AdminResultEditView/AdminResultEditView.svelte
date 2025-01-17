<script lang="ts">
	import { AdminHeader, Loading } from "$client/components"
	import { Tabs, type ToastContext, Accordion } from "@skeletonlabs/skeleton-svelte"
	import { handleClientError, handleServerError } from "$client/utils"
	import { page } from "$app/state"
	import { goto } from "$app/navigation"
	import { getContext, onMount } from "svelte"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"
	import type { Snippet } from "svelte"
	import * as Icon from "lucide-svelte"

	const toast: ToastContext = getContext("toast")

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

		// Functions
		mutateResult?: (result: Record<string, any>) => Promise<Record<string, any>>
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
		helpSnippet,

		// Functions
		mutateResult
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
		resourceApi.resourceId$(page.params.resourceId).GET({})
			.Success(async (res) => {
				result = mutateResult ? await mutateResult(res.body) : res.body
			})
			.ClientError(handleClientError({ toast}))
			.ServerError(handleServerError({ toast }))
	}

	function oncancel() {
		// If history, go back, else go to /admin
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function onsubmit(tab) {
		if (!tabs[tab].disabled) {
			tabs[tab].disabled = true
			await tabs[tab].onsubmit({ data: tabs[tab].data })
			.Success(async () => {
				toast.create({
					description: `${pluralize.singular(humanizeString(resource))} updated successfully.`,
					type: "success"
				})
				await getResult()
			})
			.ClientError(handleClientError({ toast}))
			.ServerError(handleServerError({ toast }))
			tabs[tab].disabled = false
		}
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

{#snippet updateButton(tab: {canSubmit: boolean, disabled: boolean})}
	<button
		type="button"
		class="btn preset-filled-success-500 capitalize"
		onclick={onsubmit}
		disabled={!tab.canSubmit || tab.disabled}
	>
	<Icon.Save />
	Update {currentTab !== "default"
		? humanizeString(currentTab)
		: pluralize.singular(humanizeString(resource))}
	</button>
{/snippet}

<AdminHeader>
	{#snippet title()}
		<Icon.NotebookPen />
		Edit {pluralize.singular(humanizeString(resource))}{naturalKey && result ? `: ${result[naturalKey]}` : ""}
	{/snippet}

	{#snippet controls()}
		<div class="flex justify-between" >
			<a href="/admin/{resource}/{resultId}" class="btn preset-filled-surface-500 capitalize">
				<Icon.NotebookText />
				View
			</a>
			{@render updateButton(tabs[currentTab])}
		</div>
	{/snippet}
</AdminHeader>

<!-- Display help text -->
{#if helpSnippet}
	<div class="card p-4 m-0 mb-4">
		<Accordion>
			<Accordion.Item title="Help">
				<!-- Help Icon -->
				<Icon.CircleHelp />
					
				About editing a {pluralize.singular(resource)}
					
				{@render helpSnippet()}
			</Accordion.Item>
		</Accordion>
	</div>
{/if}

<div class="card preset-tonal p-4 mb-4">
	<Tabs bind:value={currentTab}>
		{#snippet list()}
			{#each Object.keys(tabs) as tab}
				<Tabs.Control
					bind:group={currentTab}
					name={tab !== "default" ? humanizeString(tab) : pluralize.singular(humanizeString(resource))}
					value={tab}
				>
					<span>{tab !== "default" ? humanizeString(tab) : pluralize.singular(humanizeString(resource))}</span
					>
				</Tabs.Control>
			{/each}
		{/snippet}
		{#snippet content()}
			{#each Object.keys(tabs) as tab}
				<Tabs.Panel value={tab}>
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
				</Tabs.Panel>
			{/each}
		{/snippet}
	</Tabs>
</div>

<AdminHeader>
	{#snippet controls()}
		<div class="flex justify-between" >
			<button type="button" class="btn preset-filled-surface-500 capitalize" onclick={oncancel}>
				<Icon.CircleX />
				Cancel
			</button>
			{@render updateButton(tabs[currentTab])}
		</div>
	{/snippet}
</AdminHeader>
