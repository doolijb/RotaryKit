<script lang="ts">
	import { AdminHeader, Loading } from "@components"
	import Icon from "@iconify/svelte"
	import axios, { type AxiosResponse } from "axios"
	// import { type SvelteComponent, onMount } from "svelte"
	import { Tab, TabGroup, getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "@utils"
	import { page } from "$app/stores"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto, invalidateAll } from "$app/navigation"
	import { onMount } from "svelte"
	import humanizeString from "humanize-string"
	import {singular} from "pluralize"

	const toastStore = getToastStore()

	////
	// VARIABLE PROPS
	////

	export let resource: string
	export let naturalKey: string | undefined
	export let resourceId: string
	export let tabs: AdminEditResultViewTabs

	////
	// TABS
	////

	let currentTab = "default"
	$: {
		loadFormExtras()
		if (tabs[currentTab].formData === undefined) {
			tabs[currentTab].formData = {}
		}
		if (tabs[currentTab].formErrors === undefined) {
			tabs[currentTab].formErrors = {}
		}
		if (tabs[currentTab].populated === undefined) {
			tabs[currentTab].populated = false
		}
		
		if (tabs[currentTab].submitted === undefined) {
			tabs[currentTab].submitted = false
		}
	}

	async function loadFormExtras() {
		if (tabs[currentTab].getFormExtras !== undefined && tabs[currentTab].formExtras === undefined) {
			tabs[currentTab].formExtras = await tabs[currentTab].getFormExtras()
		}
	}

	////
	// RESULT
	////

	let result: Record<string, any>

	async function getResult() {
		try {
			const response: AxiosResponse = await axios.get(`/api/admin/${resource}/${resourceId}`)
			result = response.data
		} catch (error) {
			toastStore.trigger(
				new Toast({
					message: "There was an error getting the result.",
					style: "error"
				})
			)
			if(error.response.status === 403) {
				await invalidateAll()
			}
		}
	}

	function handleCancel() {
		// If history, go back, else go to /admin
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function handleSubmit() {
		await tabs[currentTab]
			.handleSubmit(tabs[currentTab].formData)
			.then((response: AxiosResponse) => {
				toastStore.trigger(
					new Toast({
						message: `${
							currentTab !== "default" ? humanizeString(currentTab) : singular(humanizeString(resource))
						} updated successfully`,
						style: "success"
					})
				)
				tabs[currentTab].submitted = true
			})
			.catch((error: any) => {
				toastStore.trigger(
					new Toast({
						message: `Error updating ${
							currentTab !== "default" ? humanizeString(currentTab) : singular(humanizeString(resource))
						}`,
						style: "error"
					})
				)
			})
	}

	onMount(async () => {
		await getResult()
	})
</script>

<AdminHeader>
	<svelte:fragment slot="title">
		<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
		Edit {singular(humanizeString(resource))}{naturalKey && result ? `: ${result[naturalKey]}` : ""}
	</svelte:fragment>

	<div class="flex justify-between" slot="controls">
		<button type="button" class="btn variant-filled-surface" on:click={handleCancel}>
			<Icon icon="material-symbols:cancel-outline" class="mr-2" />
			Cancel
		</button>
		<button
			type="button"
			class="btn variant-filled-success"
			on:click={handleSubmit}
			disabled={!tabs[currentTab].canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Update {currentTab !== "default" ? humanizeString(currentTab) : singular(humanizeString(resource))}
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
					About editing a {singular(resource)}
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
		<TabGroup class="mb-4">
			{#each Object.keys(tabs) as tab}
				<Tab
					bind:group={currentTab}
					name={tab !== "default" ? humanizeString(tab) : singular(humanizeString(resource))}
					value={tab}
				>
					<span>{tab !== "default" ? humanizeString(tab) : singular(humanizeString(resource))}</span>
				</Tab>
			{/each}
		</TabGroup>
	{/if}
	{#if result && (!tabs[currentTab].getFormExtras || !!tabs[currentTab].formExtras)}
		<svelte:component
			this={tabs[currentTab].Form}
			bind:formData={tabs[currentTab].formData}
			bind:formErrors={tabs[currentTab].formErrors}
			bind:canSubmit={tabs[currentTab].canSubmit}
			on:submit={handleSubmit}
			on:cancel={handleCancel}
			{...tabs[currentTab].formExtras || {}}
			{result}
		/>
	{:else}
		<Loading />
	{/if}
</div>

<AdminHeader>
	<div class="flex justify-between" slot="controls">
		<button type="button" class="btn variant-filled-surface" on:click={handleCancel}>
			<Icon icon="material-symbols:cancel-outline" class="mr-2" />
			Cancel
		</button>
		<button
			type="button"
			class="btn variant-filled-success"
			on:click={handleSubmit}
			disabled={!tabs[currentTab].canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Update {currentTab !== "default" ? humanizeString(currentTab) : singular(humanizeString(resource))}
		</button>
	</div>
</AdminHeader>
