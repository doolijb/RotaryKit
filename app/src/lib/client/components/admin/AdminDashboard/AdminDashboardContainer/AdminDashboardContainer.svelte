<script lang="ts">
	import Icon from "@iconify/svelte"
    import { createSwapy, type Swapy } from "swapy"
	import { slide } from "svelte/transition"
    import NewUsersModule from "../NewUsersModule"
	import { hasAdminPermission } from "$client/utils"
	import { page } from "$app/state"
    import { AdminHeader } from "$client/components"
  
    type AvailableModule = {
        item: string
        defaultColSpan?: string
    }

    type Module = AvailableModule & {
        slotId: string
    }

    type Slot = {
        slotId: string
        colSpan: string
    }

    ////
    // CONSTANTS
    ////

    const availableModules: AvailableModule[] = []

    const moduleComponents = {
        "NewUsersModule": NewUsersModule,
    }

    ////
    // CONSTANTS
    ////

    const toast: ToastContext = getContext("toast")

    ////
    // VARIABLES
    ////

    // svelte-ignore non_reactive_update
    let modules: Module[] = [] // Stateless so it doesn't interfere with swapy
    let swapy: Swapy = $state()

    ////
    // STATE
    ////

    let loaded = $state(false)
    let loadFailed = $state(false)
    let controlsOpen = $state(false)
    let swapyEnabled = $state(false)
    let columnControlsEnabled = $state(false)
    let slots: {[key: string]: Slot} = $state({})

    ////
    // FUNCTIONS
    ////

    function enableSwapy() {
        swapy.enable(true)
        swapyEnabled = true
    }

    function disableSwapy() {
        swapy.enable(false)
        swapyEnabled = false
    }

    function enableColSpan() {
        columnControlsEnabled = true
    }

    function disableColSpan() {
        columnControlsEnabled = false
    }

    function setColSpan(event: Event, slot: Slot) {
        const target = event.target as HTMLSelectElement
        slot.colSpan = target.value
    }
    
    function save() {
        disableColSpan()
        disableSwapy()

        localStorage.setItem("admin_dashboard_modules", JSON.stringify(modules))
        localStorage.setItem("admin_dashboard_slots", JSON.stringify(slots))

        const toast: ToastSettings = {
            message: "Dashboard settings saved to browser",
        }

        toast.create(toast)
    }

    function loadLayout() {
        const loadedModules = JSON.parse(localStorage.getItem("admin_dashboard_modules")) || []
        const loadedSlots = JSON.parse(localStorage.getItem("admin_dashboard_slots")) || {}

        Object.keys(slots).forEach(slotId => {
            slots[slotId] = {
                slotId,
                ...loadedSlots[slotId],
            }
        })

 
        const updatedModules: Module[] = []

        let resetModuleSlots = false
        availableModules.forEach(availableModule => {

            // Get and merge the module settings
            const loadedModule: Module = loadedModules.find(loadedModule => loadedModule.item === availableModule.item) || {} as Module 
            const module = {
                ...availableModule,
                ...loadedModule,
            }

            delete module.defaultColSpan

            // Remove any missing slots from the loaded modules
            if (!(module.slotId in slots)) {
                resetModuleSlots = true
            }
            updatedModules.push(module)
        })

        // Reset the slotId if the slot is missing
        if (resetModuleSlots) {
            Object.keys(slots).forEach((slotId, i) => {
                updatedModules[i].slotId = slotId
            })
        }

        modules = updatedModules

        // Set default colSpan if not set
        Object.entries(slots).forEach(([slotId, slot]) => {
            if (!slot.colSpan) {
                slot.colSpan = availableModules.find(am => am.item === modules.find(m => m.slotId === slotId)?.item)?.defaultColSpan || "2"
            }
        })
    }

    function selectAvailableModules() {

        // New Users Module
        if (hasAdminPermission({ 
            user: page.data.user, 
            adminPermissions: page.data.adminPermissions, 
            resources: ["users"], 
            action: "GET"
        })) {
            availableModules.push({
                item: "NewUsersModule",
                defaultColSpan: "4",
            })
        }
    }

    ////
    // COMPUTED
    ////

    // Build the slots and modules
    $effect.pre(() => {
        if (!loaded) {
            loaded = true
            try {

                selectAvailableModules()

                Array.from({ length: availableModules.length }, (_, i) => `${i + 1}`).forEach(slotId => {
                    slots[slotId] = {
                        slotId: slotId,
                        colSpan: "full",
                    }
                })

                loadLayout()
            } catch (error) {
                loadFailed = true
                console.error(error)
            }
        }
    })

    // Load the swapy instance
    $effect(() => {
        if (loaded && !swapy && !loadFailed && Object.keys(slots).length && modules.length) {
            try {
                const container = document.querySelector("#module-container")
                if (container) {

                    // Initialize
                    swapy = createSwapy(container)
                    swapy.enable(swapyEnabled)

                    // Add listeners
                    swapy.onSwap(event => {
                        event.data.array.forEach(({ slotId, itemId }) => {
                            const module = modules.find(module => module.item === itemId)
                            if (module) {
                                module.slotId = slotId
                            }
                        })
                    })
                }
            } catch (error) {
                loadFailed = true
                console.error(error)
            }
        }
    })

</script>

{#snippet moduleSnippet(module:Module)}
    <div 
        class="rounded p-4 flex-grow max-h-full relative bg-surface-100-800-token" 
        class:preset-ringed={swapyEnabled}
        data-swapy-item={module.item}
    >
        <div class="max-h-full flex-grow overflow-scroll relative" class:blur-[2px]={swapyEnabled || columnControlsEnabled}>
            {@render moduleComponents[module.item]()}
        </div>
        {#if swapyEnabled}
            <div
                class="absolute top-0 right-0 min-h-full max-h-full min-w-full max-w-full flex items-center justify-center text-center"
            >
                <Icon icon="mdi:drag" width="2.5em" class="inline" />
            </div>
        {/if}
        {#if columnControlsEnabled}
            {@const slot = slots[Object.keys(slots).find(slotId => module.slotId === slotId)]}
            <div class="absolute top-0 right-0 h-full w-full flex items-center justify-center text-center">
                <span class="preset-glass-tertiary p-4 rounded-lg">
                    <label>
                        Width
                        <select
                            class="select select-sm"
                            onchange={(event) => setColSpan(event, slot)}
                        >
                            {#each Array(3) as _, i}
                                <option 
                                    value={i + 1} 
                                    selected={slot.colSpan === (i + 1).toString()}
                                > {i + 1} </option>
                            {/each}
                            <option value="full" selected={slot.colSpan === "full"}> Full </option>
                        </select>
                    </label>
                </span>
            </div>
        {/if}
    </div>
{/snippet}

<!-- {#if !!swapy && !loadFailed}
    <div class="hidden md:flex card preset-soft-surface p-4 mb-4">
        <div class="flex-grow">
            <h1 class="h4 w-auto mb-2">
                <Icon class="h-5 w-5 inline" icon="clarity:dashboard-solid" /> Dashboard
            </h1>
            {#if swapyEnabled || columnControlsEnabled}
                <button 
                    class="btn btn-sm me-2" 
                    class:preset-filled-surface={!swapyEnabled && !columnControlsEnabled}
                    class:preset-filled-primary={swapyEnabled || columnControlsEnabled}
                    onclick={save}
                >
                <Icon icon="mdi:content-save-outline" width="1.6em" class="inline me-2" />
                    Save
                </button>
            {/if}
        </div>
        <div class="mb-4 align-middle">
            <button 
                class="btn btn-sm me-2 align-middle" 
                disabled={columnControlsEnabled || swapyEnabled}
                onclick={() => controlsOpen = !controlsOpen}
                title="Toggle controls"
            >
                <Icon icon="mdi:settings" height="1.25em" class="inline" />
            </button>
            {#if controlsOpen}
                <div class="inline-flex space-x-2" transition:slide={{ axis: "x" }}>
                    <button 
                        class="btn btn-sm me-2 my-0 align-middle" 
                        class:preset-filled-surface={!swapyEnabled}
                        class:preset-filled-primary={swapyEnabled}
                        disabled={columnControlsEnabled || swapyEnabled}
                        onclick={enableSwapy}
                    >Drag</button>
                    <button 
                        class="btn btn-sm my-0 align-middle" 
                        class:preset-filled-surface={!columnControlsEnabled} 
                        class:preset-filled-primary={columnControlsEnabled}
                        disabled={columnControlsEnabled || swapyEnabled}
                        onclick={enableColSpan}
                    >Size</button>
                </div>
            {/if}
        </div>
    </div>
{/if} -->

<AdminHeader>
    {#snippet title()}
        <Icon icon="clarity:dashboard-solid" class="mr-2 mb-1 w-auto inline" />
        Admin Dashboard	
	{/snippet}
    {#snippet controls()}
    <div class="hidden md:flex my-0">
        <div class="flex-grow">
            {#if swapyEnabled || columnControlsEnabled}
                <button 
                    class="btn btn-sm my-0" 
                    class:preset-filled-surface={!swapyEnabled && !columnControlsEnabled}
                    class:preset-filled-primary={swapyEnabled || columnControlsEnabled}
                    onclick={save}
                >
                <Icon icon="mdi:content-save-outline" width="1.6em" class="inline me-2" />
                    Save
                </button>
            {/if}
        </div>
        <div class="align-middle">
            <button 
                class="btn btn-sm me-2 align-middle mt-1" 
                disabled={columnControlsEnabled || swapyEnabled}
                onclick={() => controlsOpen = !controlsOpen}
                title="Toggle controls"
            >
                <Icon icon="mdi:settings" height="1.25em" class="inline" />
            </button>
            {#if controlsOpen}
                <div class="inline-flex space-x-2" transition:slide={{ axis: "x" }}>
                    <button 
                        class="btn btn-sm me-2 my-0 align-middle" 
                        class:preset-filled-surface={!swapyEnabled}
                        class:preset-filled-primary={swapyEnabled}
                        disabled={columnControlsEnabled || swapyEnabled}
                        onclick={enableSwapy}
                    >Drag</button>
                    <button 
                        class="btn btn-sm my-0 align-middle" 
                        class:preset-filled-surface={!columnControlsEnabled} 
                        class:preset-filled-primary={columnControlsEnabled}
                        disabled={columnControlsEnabled || swapyEnabled}
                        onclick={enableColSpan}
                    >Size</button>
                </div>
            {/if}
        </div>
    </div>
    {/snippet}
</AdminHeader>

<div id="module-container" class="lg:grid lg:grid-cols-4 xl:grid-cols-6 gap-4 w-100">
    {#if !loadFailed}
        {#each Object.keys(slots) as slotId}
            {@const slot = slots[slotId]}
            {@const module = modules.find(module => module.slotId === slotId)}
            <div 
                class="section-{slotId} h-[30em] col-span-{slot.colSpan} flex flex-col sm:mb-4 lg:mb-0" 
                class:preset-soft={swapyEnabled}
                class:rounded-lg={swapyEnabled}
                data-swapy-slot={slotId}
            >
            {#if module}
                {@render moduleSnippet(module)}
            {/if}
            </div>
        {/each}
    {:else}
        <div class="col-span-6 card preset-soft p-4">
            Hmmm... your dashboard is empty.
        </div>
    {/if}
</div>
