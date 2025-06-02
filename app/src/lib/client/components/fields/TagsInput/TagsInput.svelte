<script lang="ts">
	import { FieldBase } from "$client/components"
	import type { ComponentProps, Snippet } from 'svelte'
	import * as Icons from "lucide-svelte"
	import { toaster } from "$client/utils"
	import baseSlugify from "slugify"


	////
	// PROPS
	////

	interface Option {
		label: string
		value: string
	}

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
		// Props
		suggestions?: Option[] // Load suggested options from the server dynamically
		loadedOptions?: Option[] // Load options from the server so values can be mapped to the labels
		allowUpperCase?: boolean
	}

	let {
		ref = $bindable(undefined),
		suggestions = $bindable([]),
		loadedOptions = $bindable([]),
		...restProps
	}: Props = $props()

	////
	// VARIABLES
	////

	let inputRet: HTMLInputElement

	////
	// STATE
	////

	let prepared: ComponentProps<typeof FieldBase>["prepared"] = $state()
	let inputString: string = $state("")
	let knownOptions: Option[] = $state([]) // Store known options for label/value mapping even if suggestions/loadedOptions change

	////
	// CONSTANTS
	////

	const formCtx = restProps.form.getContext()

	////
	// FUNCTIONS
	////

	function slugify(value: string): string {
		return baseSlugify(value, { lower: true, trim: true, locale: "en" })
	}

	function onValueRemove(value: string) {
		formCtx.data[prepared.field] = (formCtx.data[prepared.field] as string[]).filter((a) => a !== value)
	}

	function onValueAdd(value: string) {
		if (!Array.isArray(formCtx.data[prepared.field])) {
			formCtx.data[prepared.field] = []
		}
		if (prepared.maxCount && (formCtx.data[prepared.field] as string[]).length >= prepared.maxCount) {
			maxSelectedReachedToast()
			return
		} else if (!(formCtx.data[prepared.field] as string[]).includes(value)) {
			(formCtx.data[prepared.field] as string[]).push(value)
		}
		inputString = ""
	}

	async function triggerInputEvent() {
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        await inputRet.dispatchEvent(event);
    }

	async function handleInputKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopImmediatePropagation
			event.stopPropagation()
			// Check if maxSelected and if it's reached
			onValueAdd(inputString)
		}
		await triggerInputEvent()
  	}

	function isOption(option: Option | string) {
		return typeof option === "object" && "label" in option && "value" in option	
	}

	function maxSelectedReachedToast() {
		toaster.create({
			description: `You can only select up to ${prepared.maxCount} items`,
			type: "warning"
		})
	}

	function getValueLabel(value: string): string {
		const label: string | undefined = knownOptions.find(
			(o) => o.value === slugify(value)
		)?.label

		return label || value
	}

	////
	// CALCULATED
	////

	let availableSuggestions: Option[] | undefined = $derived.by(() => {
		if (!suggestions || !suggestions.length) return undefined
		return suggestions.filter((s) => {
			return !(formCtx.data[prepared.field]as string[]).some((val) => {
				return slugify(val) === s.value
			})
		})
	})

	// Add any new suggestions to knownOptions
	$effect(() => {
		suggestions?.forEach((s) => {
			if (!knownOptions.some((o) => o.value === s.value)) {
				knownOptions.push(s)
			}
		})
	})
	
	// Add any new loadedOptions to knownOptions
	$effect(() => {
		loadedOptions?.forEach((o) => {
			if (!knownOptions.some((ko) => ko.value === o.value)) {
				knownOptions.push(o)
			}
		})
	})

	////
	// LIFECYCLE
	////

	// if (formCtx.data[restProps.field].length) {
	// 	syncSelectedToData()
	// }

	$effect(() => {
		console.log("Data", $state.snapshot(formCtx.data[prepared.field]))
	})

</script>

<FieldBase bind:ref {...restProps} bind:prepared>
	{#snippet children({
		id, 
		attrs, 
		field, 
		disabled, 
		maxlength, 
		minlength,
		onfocus,
		oninput,
		onblur,
		validatorLength,
		fieldValidator,
		form,
		required,
		})}
		{@const showLegend = !disabled && (validatorLength || attrs?.description)}

		<div class="input-group flex flex-col px-1 py-0 input bg-surface-200-800 gap-1">
			<div class="flex gap-1 items-center">
				<input 
					bind:this={inputRet}
					{id}
					class="appearance-none border-0 bg-transparent flex-grow my-1 focus:outline-none focus:ring-0"
					type="text" 
					bind:value={inputString} 
					placeholder={attrs.placeholder || "Type to search or add..."} 
					onkeydown={handleInputKeyDown}
					{oninput}
					{maxlength}
					{minlength}
					{onfocus}
					{onblur}
					{disabled}
					aria-label={attrs.label}
					aria-describedby={attrs.description ? `${id}-description` : undefined}
				>
				{#if prepared.maxCount}
					<div 
						class="text-sm hover:text-surface-100 ml-2 transition-all select-none text-surface-500"
						title={`You can select up to ${prepared.maxCount} items`}
					>
						{(formCtx.data[prepared.field] as string[]).length}/{prepared.maxCount}
					</div>
				{/if}
			</div>
			{#if inputString.trim().length}
				<div class="text-xs text-surface-400">
					<span>Press <kbd class="bg-surface-300-700 px-1 rounded">Enter</kbd> to add</span>
				</div>
			{/if}
			{#if formCtx.data[restProps.field] && (formCtx.data[restProps.field] as string[]).length}
				<div class="flex flex-wrap gap-1 mb-2">
					{#each (formCtx.data[restProps.field] as string[]) as val}
						<button type="button" class="chip preset-filled" onclick={() => onValueRemove(val)} title="Remove">
							{getValueLabel(val)}
							<Icons.X size="1em" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if availableSuggestions && availableSuggestions.length}
			<div class="text-xs text-surface-400 mt-2">Suggestions</div>
			<div class="flex flex-wrap gap-1 mb-2">
				{#each availableSuggestions as suggestion}
					<button 
						type="button" 
						class="autocomplete-suggestion chip preset-filled" 
						onclick={() => {
							onValueAdd(suggestion.value)
							inputRet.value = ""
							inputString = ""
						}}
						title={`Add ${suggestion.label}`}
					>
						{suggestion.label}
						<Icons.Plus size="1em" />
					</button>
				{/each}
			</div>
		{/if}
	{/snippet}
</FieldBase>

<style>

</style>
