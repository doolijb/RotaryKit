<script lang="ts">
    import { onMount } from 'svelte'
    import { Modal, Progress } from '@skeletonlabs/skeleton-svelte'

    interface AutocompleteOption {
        label: string;
        value: string | number;
    }

    let searchString = $state("")
    let options = $state([])
    let selectedValue: string | number | undefined = ""
	let isGettingOptions = $state(false)

    interface Props {
        open: boolean
        selectedOption?: AutocompleteOption | undefined
        searchTimeout: NodeJS.Timeout
        getOptions: ({searchString}) => Promise<any[]>
        mapOptions: (data: any[]) => AutocompleteOption[]
        onClose: () => void
        onConfirm: (data?: { selectedOption }) => Promise<void>
        buttonTextSubmit: string
        title: string
        body?: string
        buttonTextCancel: string
    }

    let {
        open = $bindable(),
        selectedOption = $bindable(undefined),
        searchTimeout = $bindable(),
        getOptions,
        mapOptions,
        onClose,
        onConfirm,
        buttonTextSubmit,
        title,
        body,
        buttonTextCancel
    }: Props = $props();

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

<Modal
    bind:open
>
    {#snippet content()}
        <div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
            <header class="text-2xl font-bold">{title}</header>
            <article>{body ?? '(body missing)'}</article>
            <form class="modal-form p-4 space-y-4" action="javascript:void(0)">
                <label class="label">
                    <span>Search</span>
                    <div class="flex">
                        <input class="input" type="text" bind:value={searchString} placeholder="" oninput={onSearchChange} />
                        <button type="button" class="btn preset-filled-surface ml-2" onclick={clearSearch} disabled={!searchString}>Reset</button>
                    </div>
                </label>

                <Progress height="h-1" value={isGettingOptions ? undefined : 100} />
                
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
                        <button type="button" class="btn preset-filled-error ml-2" disabled={!selectedOption} onclick={clearSelection}>Clear</button>
                    </div>
                </label>
            </form>
            <footer class="modal-footer">
                <button class="btn" onclick={onClose}>{buttonTextCancel}</button>
                <button class="btn preset-filled-primary" onclick={() => onConfirm({selectedOption})}>{buttonTextSubmit}</button>
            </footer>
        </div>
    {/snippet}
</Modal>
