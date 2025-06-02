<script lang="ts">
    import { Modal, Progress } from '@skeletonlabs/skeleton-svelte'

    interface Option {
        label: string
        value: any
    }

    interface Props {
        open: boolean
        selectedOption?: Option | undefined
        searchTimeout?: NodeJS.Timeout
        getOptions: ({search}:{search?: string}) => Promise<any[]>
        mapOptions: (data: any[]) => Option[]
        onClose: () => void
        onConfirm: (e: Event, { selectedOption }) => Promise<void>
        buttonTextSubmit?: string
        title: string
        body?: string
        buttonTextCancel?: string
    }

    let {
        open = $bindable(),
        selectedOption = $bindable(),
        searchTimeout = $bindable(),
        getOptions,
        mapOptions,
        onClose,
        onConfirm,
        buttonTextSubmit = "Submit",
        title,
        body,
        buttonTextCancel = "Cancel",
    }: Props = $props()

    // STATE
    let searchString = $state("")
    let options = $state([])
    let selectedValue: string | number | undefined
    let interimSelectedOption = $state(selectedOption)
	let isGettingOptions = $state(false)

    function clearSelection() {
        interimSelectedOption = undefined
        selectedValue = undefined
    }

	function clearSearch() {
		searchString = ""
		onSearchChange(null, {delay: 0})
	}

    async function onSearchChange(event: Event, {delay = 1000} : {delay: number | undefined} = {delay: 1000}) {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(async () => {
			isGettingOptions = true
			const results = await getOptions({ search: searchString })
            options = mapOptions(results)
			isGettingOptions = false
        }, delay)
    }

	async function onOptionSelected(event: Event) {
		const target = event.target as HTMLSelectElement
		selectedValue = target.value
		interimSelectedOption = options.find(option => option.value == selectedValue)
	}

    async function handleOnConfirm(e: Event) {
        await onConfirm(e, { selectedOption: interimSelectedOption })
    }

    $effect(() => {
        if (!open) {
            searchString = ""
            selectedValue = undefined
            interimSelectedOption = undefined
        } else {
            interimSelectedOption = selectedOption
            selectedValue = selectedOption ? selectedOption.value : undefined
            onSearchChange(null, {delay: 0})
        }
    })
</script>

<Modal
    {open}
    onOpenChange={(e) => { open = e.open }}
>
    {#snippet content()}
        <div class="bg-surface-100-900 card p-4 w-modal shadow-xl space-y-4">
            <header class="text-2xl font-bold">{title}</header>
            {#if body}
                <article class="text-sm text-surface-400">{body}</article>
            {/if}
            <form class="modal-form py-4 space-y-4" action="javascript:void(0)">
                <label class="label">
                    <div class="flex">
                        <input class="input" type="text" bind:value={searchString} placeholder="Search" oninput={onSearchChange} />
                        <button type="button" class="btn preset-filled-surface-500 ml-2" onclick={clearSearch} disabled={!searchString}>Reset</button>
                    </div>
                </label>

                <Progress height="h-1" value={isGettingOptions ? undefined : 100} />
                
                <div class="flex flex-col col-span-2">
                    <select class="select h-full" size=5 onchange={onOptionSelected}>
                        {#if !!options && options.length > 0}
                            {#each options as option}
                                <option value={option.value} selected={!!interimSelectedOption && option.value == interimSelectedOption.value}>{option.label}</option>
                            {/each}
                        {:else}
                            <option disabled>{isGettingOptions ? "Loading options..." : "No options available"}</option>
                        {/if}
                    </select>
                </div>

                <label class="label">
                    <span>Selected</span>
                    <div class="flex">
                        <div class="input-group flex grow p-1">
                            { interimSelectedOption?.label || "" }
                        </div>
                        <button type="button" class="btn preset-filled-error-500  ml-2" disabled={!interimSelectedOption} onclick={clearSelection}>Clear</button>
                    </div>
                </label>
            </form>
            <footer class="modal-footer flex justify-between">
                <button class="btn preset-filled-surface-500" onclick={onClose}>{buttonTextCancel}</button>
                <button class="btn preset-filled-primary-500 " onclick={handleOnConfirm}>{buttonTextSubmit}</button>
            </footer>
        </div>
    {/snippet}
</Modal>
