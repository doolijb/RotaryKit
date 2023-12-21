<script lang="ts">
	import { AdminHeader } from "@components"
	import Icon from "@iconify/svelte"
	import axios, { type AxiosResponse } from "axios"
	// import { type SvelteComponent, onMount } from "svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "@utils"
	import { page } from "$app/stores"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto, invalidateAll } from "$app/navigation"

	const toastStore = getToastStore()

	////
	// VARIABLE PROPS
	////
	export let resource: string
	export let displayTitle: string
	export let Form: ConstructorOfATypedSvelteComponent
	export let formExtras: { [key: string]: any } = {}

	let formData: { [key: string]: any } = {}
	let formErrors: FormErrors = {}
	let canSubmit: boolean

	function handleCancel() {
		// If history, go back, else go to /admin
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function handleSubmit() {
		await axios
			.post(`/api/admin/${resource}`, formData)
			.then((response: AxiosResponse) => {
				toastStore.trigger(
					new Toast({
						message: `${displayTitle} created successfully`,
						style: "success"
					})
				)
				goto(`/admin/${resource}/${response.data.result.id}`)
			})
			.catch(async (error: any) => {
				toastStore.trigger(
					new Toast({
						message: `Error creating ${displayTitle}`,
						style: "error"
					})
				)
				if (error.response.status === 403) {
					await invalidateAll()
				}
			})
	}
</script>

<AdminHeader>
	<svelte:fragment slot="title">
		<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
		<span class="capitalize">
			Create: {displayTitle}
		</span>
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
			disabled={!canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Create
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
					About adding a new {displayTitle}
				</svelte:fragment>
				<svelte:fragment slot="content">
					<slot name="help" />
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
{/if}

<div class="card variant-soft p-4 mb-4">
	<svelte:component
		this={Form}
		bind:formData
		bind:formErrors
		bind:canSubmit
		on:submit={handleSubmit}
		on:cancel={handleCancel}
		{...formExtras}
	/>
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
			disabled={!canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Create
		</button>
	</div>
</AdminHeader>
