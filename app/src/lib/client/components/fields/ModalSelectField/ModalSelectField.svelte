<script lang="ts">
    import { FieldBase } from "$client/components"
    import ModalSelectFieldModal from "./ModalSelectFieldModal.svelte"
	import { onMount, type ComponentProps } from "svelte"

    interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
        mapOptions: (data: any[]) => any[]
        getOptions: ({ search }: { search: string }) => Promise<any[]>
		buttonTextSubmit?: string
        title?: string
        buttonTextCancel?: string
    }

    let {
		// Props
        mapOptions,
        getOptions,
		buttonTextSubmit = "Submit",
        title = $bindable(),
        buttonTextCancel = "Cancel",

		// Bindables
        ref = $bindable(undefined),

		...restProps
    }: Props = $props()

    let selectedOption: {label: string, value: any} | undefined = $state()
    let isModalOpen = $state(false)
	let prepared: ComponentProps<typeof FieldBase>["prepared"] = $state()

    const formCtx = restProps.form.getContext()

    async function openModal() {
		await touch()
        isModalOpen = true
    }

    async function onModalConfirm(e: Event, data : { selectedOption: { label: string, value: any } }) {
        selectedOption = data.selectedOption
        formCtx.data[restProps.field] = selectedOption ? selectedOption.value : undefined
        isModalOpen = false
    }

    function onModalClose() {
        isModalOpen = false
    }

    function clearSelection() {
        formCtx.data[restProps.field] = undefined
        selectedOption = undefined
    }

	async function touch() {
		formCtx.touchedFields = {...formCtx.touchedFields, [restProps.field]: true}
		console.log("touch() touchedFields", formCtx.touchedFields)
	}

	onMount(async () => {
		if (![null, undefined].includes(formCtx.data[restProps.field]) && !selectedOption) {
			const options = mapOptions(await getOptions({ search: `${formCtx.data[restProps.field]}` }))
			if (options.length) {
				selectedOption = options.find((option) => option.value == formCtx.data[restProps.field])
			}
		}
		if (![null, undefined].includes(formCtx.data[restProps.field])) {
			await touch()
		}
	})

	$effect(() => {
		console.log("$effect touchedFields", formCtx.touchedFields)
	})

</script>

<FieldBase bind:ref bind:prepared {...restProps}>
	<div class="flex">
		{#if restProps.disabled && [null, undefined].includes(formCtx.data[restProps.field])}
			<span class="disabled select-none">N/A</span>
		{:else}
			<button
				class="input-group flex cursor-pointer text-left px-1 grow"
				title="Select"
				onclick={openModal}
				type="button"
				disabled={restProps.disabled}
			>
				<span
					class="m-2 border-0 disabled:cursor-not-allowed flex-grow"
					class:text-surface-400={!formCtx.data[restProps.field] || restProps.disabled}
					aria-label={restProps.label}
				>
					{selectedOption?.label || formCtx.data[restProps.field] || prepared.attrs.placeholder || "Choose an option"}
				</span>
			</button>
		{/if}
		{#if !restProps.disabled}
			<button
				type="button"
				class="btn preset-filled-secondary-500 ml-2"
				onclick={openModal}
				disabled={isModalOpen}
			>
				Select
			</button>
			<button
				type="button"
				class="btn preset-filled-surface-500 ml-2"
				onclick={clearSelection}
				disabled={isModalOpen || !formCtx.data[restProps.field]}
			>
				Clear
			</button>
		{/if}
    </div>
</FieldBase>

{#if !restProps.disabled}
	<ModalSelectFieldModal
		bind:open={isModalOpen}
		{mapOptions}
		{getOptions}
		bind:selectedOption
		title={title || prepared.attrs.label}
		body={prepared.attrs.description}
		{buttonTextSubmit}
		{buttonTextCancel}
		onConfirm={onModalConfirm}
		onClose={onModalClose}
	/>
{/if}
