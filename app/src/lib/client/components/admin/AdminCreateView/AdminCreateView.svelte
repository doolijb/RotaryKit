<script lang="ts">
	import { AdminHeader } from "$client/components"
	import Icon from "@iconify/svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto } from "$app/navigation"
	import humanizeString from "humanize-string"
	import pluralize from "pluralize"
	import { Toast, handleClientError, handleServerError, useFormData } from "$client/utils/index.svelte"
	import type { Component, Snippet } from "svelte"

	const toastStore = getToastStore()

	////
	// PROPS
	////

	interface Props {
		displayTitle: string;
		resource: string;
		resourceApi: ResourceApi;
		FormComponent: Component<any, any, any>;
		primaryKey?: string;
		extras?: Record<string, any>;
		requestBodyType?: "json" | "formData";
		helpSnippet?: Snippet;
	}

	let {
		// Props
		displayTitle,
		resource,
		resourceApi,
		FormComponent,
		primaryKey = "id",
		extras = {},
		requestBodyType = "json",

		// Snippets
		helpSnippet,
	}: Props = $props();

	////
	// STATE
	////

	let canSubmit: boolean = $state(false)
	let disabled: boolean = $state(false)
	let data = $state({} as FormDataOf<any>)

	////
	// EVENTS
	////

	async function oncancel(e: Event) {
		if (window.history.length > 2) {
			window.history.back()
		} else {
			goto("/admin")
		}
	}

	async function onsubmit() {
		if (!disabled) {
			disabled = true
			let body: Record<string, any> | FormData

			switch(requestBodyType) {
				case "json":
					body = data
					break
				case "formData":
					body = useFormData({data})
					break
			}

			await resourceApi.POST({body})
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
			
				disabled = false
		}
	}
</script>

{#snippet createButton()}
	<button
		type="button"
		class="btn variant-filled-success"
		onclick={onsubmit}
		disabled={!canSubmit}
	>
		<Icon icon="mdi:floppy" class="mr-2" />
		Create
	</button>
{/snippet}

{#snippet cancelButton()}
	<button type="button" class="btn variant-filled-surface" onclick={oncancel}>
		<Icon icon="material-symbols:cancel-outline" class="mr-2" />
		Cancel
	</button>
{/snippet}

<AdminHeader>
	{#snippet title()}
	
			<Icon icon="mdi:table" class="mr-2 mb-1 w-auto inline" />
			<span class="capitalize">
				Create: {displayTitle}
			</span>
		
	{/snippet}

	{#snippet controls()}
		<div class="flex justify-between" >
			{@render cancelButton()}
			{@render createButton()}
		</div>
	{/snippet}
</AdminHeader>

{#if helpSnippet}
	<div class="card bg-surface-100-800-token p-4 m-0 mb-4">
		<Accordion>
			<AccordionItem title="Help">
							
				<Icon icon="mdi:help-circle-outline" class="mr-2 mb-1 w-auto inline" />
					
				About adding a new {displayTitle}
					
				{@render helpSnippet?.()}

			</AccordionItem>
		</Accordion>
	</div>
{/if}

<div class="card bg-surface-100-800-token p-4 mb-4">
	<FormComponent
		bind:canSubmit
		bind:disabled
		bind:data
		{onsubmit}
		{oncancel}
		{...extras}
	/>
</div>

<AdminHeader>
	{#snippet controls()}
		<div class="flex justify-between" >
			{@render cancelButton()}
			{@render createButton()}
		</div>
	{/snippet}
</AdminHeader>
