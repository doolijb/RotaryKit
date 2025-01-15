<script lang="ts">
	import { ValidationBadges } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { getContext } from "svelte"
	import { v4 } from "uuid"
	import { Combobox } from "@skeletonlabs/skeleton-svelte"
	import type { ToastContext } from "@skeletonlabs/skeleton-svelte"
	import type { FormSchema } from "$shared/validation/base"
	import type { Snippet } from 'svelte'
	import humanizeString from "humanize-string"

	const toast: ToastContext = getContext("toast")

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string
		placeholder?: string
		label?: string
		autocomplete?: string
		options: AutocompleteOption[]
		allowUpperCase?: boolean

		// Bindables
		form?: FormSchema
		data?: Record<string, any>
		errors?: Record<string, any>
		ref?: any
		type?: string
		disabled?: boolean
		id?: string
		isTouched?: boolean
		input?: string

		// Events
		oninput?: (e: Event) => Promise<void> | void
		onfocus?: (e: Event) => Promise<void> | void
		onblur?: (e: Event) => Promise<void> | void

		// Snippets
		prefixSnippet?: Snippet
		suffixSnippet?: Snippet
	}

	let {
		// Props
		field,
		placeholder = "",
		label,
		options,

		// Bindables
		form = $bindable(),
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		ref = $bindable(undefined),
		type = $bindable("text"),
		disabled = $bindable(false),
		id = $bindable(v4()),
		isTouched = $bindable(false),
		input = $bindable(""),

		// Events
		oninput,
		onfocus,
		onblur,
	}: Props = $props()

	////
	// VARIABLES
	////

	let inputRet: HTMLInputElement

	////
	// STATE
	////

	let fieldErrors: FieldErrors = $state({})
	let selectedList: (unknown|Autocomplete)[] = $state([])
	let chipList: unknown[] = $state([])
	let inputString: string = $state("")
	let validatorLength: number = $state(0)

	////
	// FUNCTIONS
	////

	async function validate() {
		let fieldErrors = await form.fields[field].validate({key:field, data})
		if (Object.keys(fieldErrors).length) {
			errors[field] = fieldErrors
		} else {
			delete errors[field]
		}
	}

	async function touch() {
		isTouched = true
		await validate()
	}

	async function handleOnBlur(e: Event) {
		await touch()
		await onblur?.(e)
	}

	async function handleOnInput(e: Event) {
		await touch()
		await oninput?.(e)
	}

	async function onOptionSelect(e: CustomEvent<AutocompleteOption<unknown, unknown> | unknown>) {
		// Check if maxSelected and if it's reached
		if (maxSelected && selectedList.length >= maxSelected) {
			maxSelectedReachedToast()
			return
		}
		selectedList.push(e.detail)
		syncDataToSelected()
		inputRet.value = ""
		await triggerInputEvent()
	}

	function onOptionRemove(option: AutocompleteOption<unknown, unknown> | unknown) {
		selectedList = selectedList.filter((a) => a !== option)
		syncDataToSelected()
	}

	function syncDataToSelected() {
		const newData: unknown[] = []
		const newChipList: unknown[] = []
		selectedList.forEach((o: unknown | AutocompleteOption) => {
			if (isAutocompleteOption(o)) {
				newChipList.push(o.label)
				newData.push(o.value)
			} else {
				newChipList.push(o)
				newData.push(o)
			}
		})
		chipList = newChipList
		data[field] = newData
	}

	function syncSelectedToData() {
		const newSelectedList: (unknown|Autocomplete)[] = []
		data[field].forEach((slug: string) => {
			const option = options.find((o) => {
				if (isAutocompleteOption(o)) {
					return o.value === slug
				} else {
					return `${o}` === slug
				}
			})
			if (option) {
				newSelectedList.push(option)
			}
		})
		selectedList = newSelectedList
		syncDataToSelected()
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
			if (maxSelected && selectedList.length >= maxSelected) {
				maxSelectedReachedToast()
				return
			}

			const value = inputString.trim()
			if (!value) {
				await triggerInputEvent()
				return
			}

			// Check if string is already in the list
			const exists = !!selectedList.find((o: AutocompleteOption | unknown) => {
				if (isAutocompleteOption(o)) {
					return (o.label as string).toLowerCase() === value.toLowerCase()
				} else {
					return o === value
				}
			})


			if (exists) {
				inputRet.value = ""
				await triggerInputEvent()
				return
			}

			// Check if string is in the options
			const option = options.find((o) => {
				if (isAutocompleteOption(o)) {
					return o.label.toLowerCase() === value.toLowerCase() 
					|| o.value === value.toLowerCase()
				} else {
					return `${o}`.toLowerCase() === value.toLowerCase()
				}
			})

			if (option) {
				selectedList.push(option)
				inputRet.value = ""
				await triggerInputEvent()
				return
			}

			if (attrs?.maxLength && value.length > attrs.maxLength) {
				toast.create({
					description: `You can only enter up to ${attrs.maxLength} characters`,
					type: "error",
				})
				await triggerInputEvent()
				return
			}

			if (attrs?.minLength && value.length < attrs.minLength) {
				toast.create({
					description: `You must enter at least ${attrs.minLength} characters`,
					type: "error",
				})
				await triggerInputEvent()
				return
			}

			selectedList.push(inputString.trim())
			inputRet.value = ""
			syncDataToSelected()
			inputRet.focus()
			await triggerInputEvent()
		}
  	}

	function isAutocompleteOption(option: AutocompleteOption | unknown) {
		return typeof option === "object" && "label" in option && "value" in option	
	}

	function maxSelectedReachedToast() {
		toast.create({
			description: `You can only select up to ${maxSelected} items`,
			type: "warning"
		})
	}

	////
	// CALCULATED
	////

	let availableOptions = $derived(options.filter((o) => {
		if (isAutocompleteOption(o)) {
			return !selectedList.find((s) => {
				if (isAutocompleteOption(s)) {
					return s.value === o.value
				} else {
					return s === o.value
				}
			})
		} else {
			return !selectedList.find((s) => {
				if (isAutocompleteOption(s)) {
					return s.value === o
				} else {
					return s === o
				}
			})
		}
	}))
	let fieldValidator = $derived(form.fields[field])
	let attrs: FormFieldAttributes | undefined = $derived(form ? form.fieldAttributes[field] : {})
	let maxSelected = $derived.by(() => {
		if (fieldValidator) {
			const validator = fieldValidator.validators.find( v => {
				return v.key === "maxLength"
			})
			if (validator) {
				return validator.args["maxLen"]
			}
		}
	})

	$effect(() => {
		fieldErrors = errors[field] || {}
	})

	$effect(() => {
		if (!placeholder && attrs) {
			placeholder = attrs.placeholder
		}
	})

	$effect(() => {
		if (!label) {
			if (attrs && attrs.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect(() => {
		if (ref) {
			ref.type = type
		}
	})
	
	$effect(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	})
	let validState = $derived(isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE)

	////
	// LIFECYCLE
	////

	if (data[field].length) {
		syncSelectedToData()
		touch()
	}

</script>

<div class="mb-2" {onfocus} onblur={handleOnBlur}>
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} bind:fieldErrors />
		{/if}
	</div>

	<div class="input-group flex flex-col items-start rounded p-0 m-0" class:border-error-500={validState === ValidStates.INVALID} onsubmit={(e) => {e.preventDefault(); e.stopImmediatePropagation; e.stopPropagation()}}>
		<div class="flex flex-grow w-full pl-0 pr-0 ml-0 pr-0">
			<input 
				bind:this={inputRet}
				{id}
				class="flex-grow"
				type="text" 
				bind:value={inputString} 
				placeholder={placeholder || "Type to search or add..."} 
				onkeydown={handleInputKeyDown}
				onsubmit={(e) => {e.preventDefault(); e.stopImmediatePropagation; e.stopPropagation(); return false}}
				oninput={handleOnInput}
				maxlength={attrs?.maxLength}
				minlength={attrs?.minLength}
			>
			{#if maxSelected}
				<div 
					class="text-sm hover:text-surface-100 ml-2 transition-all select-none"
					class:text-surface-500={selectedList.length < maxSelected}
					class:text-surface-200={selectedList.length == maxSelected}
					title={`You can select up to ${maxSelected} items`}
				>
					{selectedList.length}/{maxSelected}
				</div>
			{/if}
		</div>
		{#if selectedList.length}
			<div class="flex flex-wrap gap-1 pb-2">
				{#each selectedList as option}
					<button type="button" class="chip preset-filled" onclick={() => onOptionRemove(option)}>
						{isAutocompleteOption(option) ? option.label : option}
						<Icon icon="mdi:close" class="ml-2" />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div 
		class="card flex min-h-10 max-h-48 p-4 overflow-y-auto mt-2" 
		tabindex="-1"
	>
		<Combobox 
			value={[input]} 
			data={options.filter((i) => selectedList.map((o: AutocompleteOption | unknown) => isAutocompleteOption(o) ? o.value : o).includes(i))} 
			onValueChange={onOptionSelect} 
			inputBehavior="autocomplete" 
			deny
		/>
	</div>

</div>

<style>
	input {
		margin: 0 !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}
</style>
