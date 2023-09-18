<script lang="ts">
    import {BaseTextInput} from "@components"
    import fieldValidators from "@validators/fields"
    import type {IFieldValidator, IFieldValidatorSet} from "@interfaces"

    export let disabled = false

    export let errors: IFieldValidator[] = []
    /**
     * Variables
     */
    export let label = "Email Address"
    export let onBlur: (e: Event) => void | undefined
    export let onFocus: (e: Event) => void | undefined
    // Events
    export let onInput: (e: Event) => void | undefined


    // Refs
    export let ref: HTMLInputElement

    export let type = "email"

    export let validators: IFieldValidatorSet = fieldValidators.email()

    export let value = ""

    // Transform value
    $: value = value.toLocaleLowerCase().trim()
</script>

<BaseTextInput
    bind:label
    bind:type
    bind:validators
    bind:value
    bind:errors
    bind:disabled
    bind:ref
    bind:onFocus
    bind:onBlur
    bind:onInput
/>

<style lang="postcss">
</style>
