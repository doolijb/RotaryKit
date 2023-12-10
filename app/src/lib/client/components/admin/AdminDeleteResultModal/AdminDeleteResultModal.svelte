<script lang="ts">
	import { AdminHeader } from "@components"
	import Icon from "@iconify/svelte"
	import axios, { type AxiosResponse } from "axios"
	// import { type SvelteComponent, onMount } from "svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import { Toast } from "@utils"
	import { page } from "$app/stores"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import { goto } from "$app/navigation"

	const toastStore = getToastStore()

	////
	// VARIABLE PROPS
	////
	export let resource: string
	export let displayTitle: string
	export let resourceId: string

	function handleCancel() {
		// // If history, go back, else go to /admin
		// if (window.history.length > 2) {
		// 	window.history.back()
		// } else {
		// 	goto("/admin")
		// }
	}

	async function handleSubmit() {
		// await axios
		// 	.post(`/api/admin/${resource}`, formData)
		// 	.then((response: AxiosResponse) => {
		// 		toastStore.trigger(new Toast({
		// 			message: `${displayTitle} created successfully`,
		// 			style: "success",
		// 		}))
		// 		goto(`/admin/${resource}/${response.data.result.id}`)
		// 	})
		// 	.catch((error: any) => {
		// 		toastStore.trigger(new Toast({
		// 			message: `Error creating ${displayTitle}`,
		// 			style: "error",
		// 		}))
		// 	})
	}
</script>

<div class="card p-4 variant-filled">
	<div class="mb-4">
		<span class="h4">
			<Icon icon="mdi:exclamation-thick" class="mr-2 mb-1 w-auto inline" />
			Delete: {displayTitle}
		</span>
	</div>
	<div class="mb-4">
		<p>
			Are you sure you want to delete this {displayTitle}?
		</p>
	</div>
	<div class="mb-4">
		<button class="btn variant-filled-error mr-2" on:click={handleSubmit}>
			<Icon icon="mdi:check" class="mr-2 mb-1 w-auto inline" />
			Yes
		</button>
		<button class="btn variant-filled-secondary" on:click={handleCancel}>
			<Icon icon="mdi:close" class="mr-2 mb-1 w-auto inline" />
			No
		</button>
	</div>
</div>
