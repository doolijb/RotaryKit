<script lang="ts">
    import {BasicSearchSelectField} from "@components"
    import {countries} from "@data"
    import { validators as v } from "@validation"
    import type {ICountry, IValidator, IRegion} from "@interfaces"
    import type {AutocompleteOption} from "@skeletonlabs/skeleton"
    import type { CountryCode } from "libphonenumber-js"

    export let label = "Region"
    export let placeholder = "Search regions"
    export let value: any = null
    export let validators: IValidator[] = [v.required()]
    export let errors: IValidator[] = []
    export let disabled = false
    // Events
    export let onInput: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined
    export let onBlur: (e: Event) => void | undefined
    // Refs
    export let ref: HTMLInputElement
    // Component specific
    export let countryCode: CountryCode

    /**
     * Variables
     */
    $: country = countryCode ? countries[countryCode] : null as ICountry
    $: options = country ? getOptions() : [] as AutocompleteOption[]

    /**
     * Functions
     */
    function getOptions(): AutocompleteOption[] {
        let regions = null
        // Get regions
        try {
            regions = country.getRegions()
        } catch (e) {
            console.log(e)
            return []
        }
        // Return options
        return [...regions.values()].map((region: IRegion) => ({
            label: region.name,
            value: region.code,
            keywords: region.keywords
        })).sort((a: AutocompleteOption, b: AutocompleteOption) => a.label.localeCompare(b.label))
    }

</script>
{#if countryCode && options.length > 0}
    <BasicSearchSelectField
        label={country && country.regionTitle ? country.regionTitle : label}
        {placeholder}
        {options}
        {validators}
        {onInput}
        {onFocus}
        {onBlur}
        bind:value
        bind:errors
        bind:disabled
        bind:ref
    />
{/if}

<style lang="postcss">
</style>
