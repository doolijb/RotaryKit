<script lang="ts">
    import {BasicSearchSelectField} from "@components"
    import { GenderIdentities } from "@constants"
    import { validators as v } from "@validation"
    import type {IValidator} from "@interfaces"
    import type {AutocompleteOption} from "@skeletonlabs/skeleton"


    export let disabled = false

    export let errors: IValidator[] = []
    /**
     * Exported Props
     */
    export let label = "Gender"
    export let onBlur: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined
    // Events
    export let onInput: (e: Event) => void | undefined

    export let placeholder = "Search genders"


    // Refs
    export let ref: HTMLInputElement



    export let searchInput = ""


    export let validators: IValidator[] = [v.required()]

    export let value: any = null

    /**
     * Variables
     */
    const options: AutocompleteOption[] = Object.entries(GenderIdentities).map(([value, label]) => ({
        value,
        label,
    }))
</script>

<BasicSearchSelectField
    {label}
    {placeholder}
    {options}
    {validators}
    {onInput}
    {onFocus}
    {onBlur}
    bind:value
    bind:searchInput
    bind:errors
    bind:disabled
    bind:ref
/>

<style lang="postcss">
</style>
