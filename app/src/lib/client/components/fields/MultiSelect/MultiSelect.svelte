<script lang="ts">
	import { FieldBase } from "$client/components"
	import * as Icon from "lucide-svelte"
	import type { ComponentProps } from "svelte"

	////
	// PROPS
	////

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
		// Props
		options: MultiSelectOption[]
		size?: number

		// Bindables
		selectedValues?: string[]
		selectedAvailable?: string[]
	}

	let {
		// Props
		options,
		size = 4,

		// Bindables
		ref = $bindable(undefined),
		selectedValues = $bindable([]),
		selectedAvailable = $bindable([]),

		...restProps
	}: Props = $props();

	////
	// CONSTANTS
	////

	const formCtx = restProps.form.getContext()

	////
	// STATE
	////

	let prepared: ComponentProps<typeof FieldBase>["prepared"] = $state()

	////
	// FUNCTIONS
	////

	function handleAdd() {

		formCtx.data[restProps.field] = [... new Set([...Object.values(formCtx.data[restProps.field]), ...selectedAvailable])]
		selectedAvailable = []
	}

	function handleRemove() {
		formCtx.data[restProps.field] = Object.values(formCtx.data[restProps.field]).filter( value => !selectedValues.includes(value))
		selectedValues = []
	}

	////
	// CALCULATED
	////

	let canRemove = $derived(!!selectedValues.length) 
	let canAdd = $derived(!!selectedAvailable.length)

</script>

<div>
	<FieldBase bind:ref {...restProps} bind:prepared />
	
	<div class="sm:flex sm:flex-col md:grid md:grid-cols-5 gap-4">
		<div class="flex flex-col col-span-2">
			<select class="select h-full" multiple bind:value={selectedAvailable} {size} disabled={prepared.disabled}>
				{#each Object.values(options) as {value, label}}
					{#if !Object.values(formCtx.data[prepared.field]).includes(value)}
						<option {value}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm" class:disabled={prepared.disabled}>
				Available options: {Object.keys(options).length - Object.values(formCtx.data[prepared.field]).length}
				</span>
		</div>

		<div class="flex flex-col w-auto">
			<div class="flex flex-col items-center justify-center h-full">
				<button
					type="button"
					class="btn btn-primary btn-sm mb-2"
					onclick={handleAdd}
					disabled={!canAdd || prepared.disabled}
					title={canAdd ? "Add selected options" : "First select an option to add"}
				>
					<Icon.ArrowDown  class="md:hidden w-4 h-4" />
					<span class="mx-2">
						Add
					</span>
					<Icon.ArrowRight class="hidden md:inline w-4 h-4" />
				</button>
				<button
					type="button"
					class="btn btn-primary btn-sm mb-3"
					onclick={handleRemove}
					disabled={!canRemove || prepared.disabled}
					title={canRemove ? "Remove selected options" : "First select an option to remove"}
				>
					<Icon.ArrowUp class="md:hidden w-4 h-4" />
					<Icon.ArrowLeft class="hidden md:inline-block w-4 h-4" />
					<span class="mx-2">
						Remove
					</span>
				</button>
			</div>
		</div>

		<div class="flex flex-col col-span-2">
			<select
				id={prepared.id}
				class="select h-full border-success-500"
				multiple
				bind:value={selectedValues}
				{size}
				bind:this={ref}
				disabled={prepared.disabled}
				oninput={prepared.oninput}
				onblur={prepared.onblur}
				onfocus={prepared.onfocus}
				aria-label={prepared.label}
				required={prepared.required}
			>
				{#each Object.values(options) as {value, label}}
					{#if Object.values(formCtx.data[prepared.field]).includes(value)}
						<option value={value}>{label}</option>
					{/if}
				{/each}
			</select>
			<span class="text-surface-300 text-sm" class:disabled={prepared.disabled}>Selected options: {Object.values(formCtx.data[prepared.field]).length}</span>
		</div>
	</div>
</div>

<style lang="postcss">
	select {
		gap: 0;
	}
	option {
		font-size: 0.875rem;
		margin: none !important;
	}
</style>