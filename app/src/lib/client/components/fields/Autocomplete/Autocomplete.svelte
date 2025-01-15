<script lang="ts">
    import { run } from 'svelte/legacy';

    import { ValidationBadges, ValidationLegend } from "$client/components"
    import { ValidStates } from "$shared/constants"
    import { Autocomplete, popup, type PopupSettings } from "@skeletonlabs/skeleton-svelte"
    import type { AutocompleteOption } from "@skeletonlabs/skeleton-svelte"
	import { createEventDispatcher, onMount } from "svelte"
	import { v4 } from "uuid"
	import type { FormSchema } from "$shared/validation/base"

	const dispatch = createEventDispatcher()

	////
	// UPSTREAM EXPORTS
	

	const attrs: FormFieldAttributes | undefined = form.fieldAttributes[field]

	////
	// LOCAL EXPORTS
	

    interface Props {
        ////
        field: string;
        form: FormSchema;
        data: typeof form["Data"];
        errors: FormErrors;
        options: AutocompleteOption[];
        ////
        ref?: HTMLInputElement | null;
        placeholder?: any;
        label?: string;
        disabled?: boolean;
        type?: string;
        id?: string;
        isTouched?: boolean;
        searchInput?: string;
        autocomplete?: string;
        prefix?: import('svelte').Snippet;
        suffix?: import('svelte').Snippet;
    }

    let {
        field,
        form,
        data = $bindable({} as FormDataOf<any>),
        errors = $bindable({}),
        options,
        ref = $bindable(null),
        placeholder = attrs?.placeholder,
        label = attrs?.label,
        disabled = $bindable(false),        type = "text",
        id = v4(),
        isTouched = $bindable(false),
        searchInput = $bindable(""),
        autocomplete = undefined,
        prefix,
        suffix
    }: Props = $props();

    ////
    // STATE
    ////

    let fieldErrors: FieldErrors = $state({})

    ////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()
    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: v4(),
        placement: "bottom"
    }

	////
	// FUNCTIONS
	////

	function setType(node: HTMLInputElement) {
		node.type = type
	}

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
		validate()
	}

    function updateField() {
        if (searchInput) {
            const option = getOptionByLabel(searchInput)
            if (option) {
                data[field] = option.value
                searchInput = option.label
            } else {
                data[field] = undefined
                searchInput = ""
            }
        } else if (selectedOption) {
            if (searchInput !== selectedOption.label) {
                searchInput = selectedOption.label
            }
        } else {
            data[field] = undefined
            searchInput = ""
        }
        isTouched = true
        validate()
    }

    function showOptions() {
        popup(ref, popupSettings)
    }

    function getOptionByLabel(label: string): AutocompleteOption {
        // Find the option by label so we can track state during input or selection
        const option = options.find(
            option =>
                option.label.toLocaleLowerCase() === label.toLocaleLowerCase()
        )
        return option
    }

    function getOptionByValue(value: any): AutocompleteOption {
        // Find the option by value so we can track state during input or selection
        const option = options.find(option => option.value === value)
        return option
    }

    function handleSelection(e: CustomEvent) {
        // When an option is selected, update the search input,
        // the value will be updated automatically by the reactive variables
        if (!e.detail) {
            searchInput = ""
        } else {
            searchInput = e.detail.label
        }
        updateField()
    }

	////
	// EVENTS
	////

	function handleOnBlur(e: Event) {
        updateField()
		touch()
		dispatch("blur", e)
	}

	function handleOnFocus(e: Event) {
		dispatch("focus", e)
	}

	function handleOnInput(e: Event) {
		touch()
		dispatch("input", e)
	}

    ////
	// CALCULATED
	////

	let fieldValidator = $derived(form.fields[field])
	let validatorLength = $state(0);
    
	run(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	});
	let required = $derived(fieldValidator.isRequired)
	let validState = $derived(isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE)
    let selectedOption = $derived(Object.values(options).find(option => option.value === data[field]) || null)

    $effect(() => {
        fieldErrors = errors[field] || {}
    })

	////
	// LIFECYCLE
	////

	onMount(() => {
		if (data[field]) {
            updateField() 
            touch()
        }
	})

</script>

<div class="mb-2">
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

    <div class="input-group flex">
        {#if prefix}
			<div class="align-middle m-0 px-0">
				{@render prefix?.()}
			</div>
		{/if}
        <input
            {id}
            class="input border-0 disabled:cursor-not-allowed"
            use:setType
            use:popup={popupSettings}
            bind:value={searchInput}
            bind:this={ref}
            placeholder={!disabled ? placeholder : ""}
            {disabled}
            oninput={handleOnInput}
			onfocus={handleOnFocus}
			onblur={handleOnBlur}
            aria-label={label}
            {required}
            {autocomplete}
        />
        {@render suffix?.()}
        {#if !disabled && validatorLength}
			<div class="legendIcon align-middle px-0 me-3">
				<ValidationLegend.Icon {fieldValidator} bind:fieldErrors {validState} {legendPopup} />
			</div>
		{/if}
    </div>
    {#if !disabled && (validatorLength || attrs?.description)}
		<ValidationLegend.Popup {fieldValidator} bind:fieldErrors {legendPopup} {attrs} />
	{/if}
    <div 
        class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" 
        tabindex="-1"
        data-popup={popupSettings.target}
        >
        <Autocomplete input={searchInput} {options} on:selection={handleSelection} />
        {#if searchInput}
            <div class="text-center">
                <button
                    class="mt-3 select-none"
                    type="button"
                    onclick={e => {
                        data[field] = ""
                        searchInput = ""
                        touch()
                        e.preventDefault()
                    }}
                >
                    Clear
                </button>
            </div>
        {/if}
    </div>
</div>
    
<style lang="postcss">
    .input:focus-visible {
        outline: none;
        border: none;
    }
</style>
