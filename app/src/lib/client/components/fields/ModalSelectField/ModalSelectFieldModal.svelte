<script lang="ts">
	import type { AutocompleteOption } from '@skeletonlabs/skeleton'
    import { onMount } from 'svelte'
    import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton'

	const modalStore = getModalStore()

    let searchString = $state("")
    let options = $state([])
    let selectedValue: string | number | undefined = ""
	let isGettingOptions = $state(false)
    interface Props {
        selectedOption?: AutocompleteOption | undefined;
        searchTimeout: NodeJS.Timeout;
        getOptions: ({searchString}) => Promise<any[]>;
        mapOptions: (data: any[]) => AutocompleteOption[];
        parent: any;
    }

    let {
        selectedOption = $bindable(undefined),
        searchTimeout = $bindable(),
        getOptions,
        mapOptions,
        parent
    }: Props = $props();

    function onFormSubmit() {
        if ($modalStore[0].response) $modalStore[0].response({ selectedOption })
        modalStore.close()
    }

    function clearSelection() {
        selectedOption = undefined
        selectedValue = ""
    }

	function clearSearch() {
		searchString = ""
		onSearchChange(null, {delay: 0})
	}

    async function onSearchChange(event: Event, {delay = 1000} : {delay: number | undefined} = {delay: 1000}) {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(async () => {
			isGettingOptions = true
			const results = await getOptions({ searchString })
            options = mapOptions(results)
			isGettingOptions = false
        }, delay)
    }

	async function onOptionSelected(event: Event) {
		const target = event.target as HTMLSelectElement
		selectedValue = target.value
		selectedOption = options.find(option => option.value == selectedValue)
	}

    function onSelectedValueChange(event) {
        const selectedValues = Array.from(event.target.selectedOptions).map((option: AutocompleteOption) => option.value) as [string|number]
        selectedValue = selectedValues ? selectedValues[0] : undefined
        selectedOption = options.find(option => selectedValues.includes(option.value))
    }

    onMount(async () => {
        if (selectedOption) {
            selectedValue = selectedOption.value as string | number
        }
        await onSearchChange(null, {delay: 0})
    })
</script>

{#if $modalStore[0]}
    <div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
        <header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
        <article>{$modalStore[0].body ?? '(body missing)'}</article>
        <form class="modal-form p-4 space-y-4" action="javascript:void(0)">
            <label class="label">
                <span>Search</span>
                <div class="flex">
                    <input class="input" type="text" bind:value={searchString} placeholder="" oninput={onSearchChange} />
                    <button type="button" class="btn variant-filled-surface ml-2" onclick={clearSearch} disabled={!searchString}>Reset</button>
                </div>
            </label>

			<ProgressBar height="h-1" value={isGettingOptions ? undefined : 100} meter={isGettingOptions ? "bg-surface-900-50-token" : "bg-surface-200-700-token"} />
            
            <div class="flex flex-col col-span-2">
                <select class="select h-full" size=5 onchange={onOptionSelected}>
                    {#if !!options && options.length > 0}
                        {#each options as option}
                            <option value={option.value} selected={!!selectedOption && option.value == selectedOption.value}>{option.label}</option>
                        {/each}
					{:else}
						<option disabled>No options available</option>
                    {/if}
                </select>
            </div>

            <label class="label">
                <span>Selected</span>
                <div class="flex">
                    <input class="input" type="text" value={selectedOption ? selectedOption.label : ''} readonly />
                    <button type="button" class="btn variant-filled-error ml-2" disabled={!selectedOption} onclick={clearSelection}>Clear</button>
                </div>
            </label>
        </form>
        <footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn variant-filled-primary" onclick={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
    </div>
{/if}