<script lang="ts">
    import {BasicTextInput} from "@components"
    import type {IFieldValidator, IFieldErrors} from "@interfaces"

    // Values
    export let label = "Email Address"
    export let value = ""
    export let placeholder: string | undefined
    export let disabled = false
    export let type = "email"

    // Events
    export let onInput: (e: Event) => void | undefined
    export let onBlur: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined

    // Refs
    export let ref: HTMLInputElement

    // Validation
    export let fieldValidator: IFieldValidator
    export let fieldErrors: IFieldErrors = {}
    
</script>

<BasicTextInput
    bind:label
    bind:type
    bind:fieldValidator
    bind:value
    bind:fieldErrors
    bind:disabled
    bind:ref
    bind:placeholder
    bind:onFocus
    bind:onBlur
    bind:onInput
/>

<style lang="postcss">
</style>
