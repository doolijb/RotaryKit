<script lang="ts">
	import { AdminHeader } from "$client/components"
	import Icon from "@iconify/svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto } from "$app/navigation"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"
	import { Toast, handleClientError, handleServerError } from "$client/utils"

	const toastStore = getToastStore()

	////
	// PARENT EXPORTS
	////

	export let displayTitle: string
	export let resource: string
	export let resourceApi: ResourceApi
	export let FormComponent: ConstructorOfATypedSvelteComponent
	export let primaryKey: string = "id"
	export let extras: Record<string, any> = {}

	////
	// CHILD EXPORTS
	////

	let canSubmit: boolean = undefined
	let formComponent: ATypedSvelteComponent = undefined
	let data: Record<string, any> = undefined

	////
	// EVENTS
	////

	async function onCancel(e: Event) {
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function onSubmit(e?: Event) {
		await resourceApi.POST({body: data})
			.Success(async (r) => {
				toastStore.trigger(
					new Toast({
						message: `${pluralize.singular(humanizeString(resource))} created successfully.`,
						style: "success"
					})
				)
				goto(`/admin/${resource}/${r.body.result[primaryKey]}`)
			})
			.ClientError(handleClientError({ toastStore}))
			.ServerError(handleServerError({ toastStore }))
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
		<button type="button" class="btn variant-filled-surface" on:click={onCancel}>
			<Icon icon="material-symbols:cancel-outline" class="mr-2" />
			Cancel
		</button>
		<button
			type="button"
			class="btn variant-filled-success"
			on:click={onSubmit}
			disabled={!canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Create
		</button>
	</div>
</AdminHeader>

{#if $$slots.help}
	<div class="card variant-soft p-4 m-0 mb-4">
		<Accordion>
			<AccordionItem title="Help">
				<svelte:fragment slot="lead">
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
		this={FormComponent}
		bind:this={formComponent}
		bind:canSubmit
		bind:data
		on:submit={onSubmit}
		on:cancel={onCancel}
		{...extras}
	/>
</div>

<AdminHeader>
	<div class="flex justify-between" slot="controls">
		<button type="button" class="btn variant-filled-surface" on:click={onCancel}>
			<Icon icon="material-symbols:cancel-outline" class="mr-2" />
			Cancel
		</button>
		<button
			type="button"
			class="btn variant-filled-success"
			on:click={onSubmit}
			disabled={!canSubmit}
		>
			<Icon icon="mdi:floppy" class="mr-2" />
			Create
		</button>
	</div>
</AdminHeader>
